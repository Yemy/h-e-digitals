import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Server-side PDF generation using PDFKit and qrcode
import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { courseId } = await req.json()
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 })

    const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } }, include: { course: { include: { instructor: true } }, user: true } })
    if (!enrollment) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })

    // Minimal completion check: enrollment.progress >= course.passPercentage or completedAt set
    const course = enrollment.course
    const passed = enrollment.progress >= (course.passPercentage ?? 80) || enrollment.completedAt != null
    if (!passed) return NextResponse.json({ error: "Course not yet completed" }, { status: 400 })

    // create certificate record
    const certificateId = `CPD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`

    const cert = await prisma.certificate.create({ data: {
      certificateId,
      userId: session.user.id,
      courseId: course.id,
      cpdHours: course.cpdHours
    }})

    // generate QR code to public verification link
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/certificate/verify?cid=${encodeURIComponent(certificateId)}`
    const qrDataUrl = await QRCode.toDataURL(verificationUrl)

    // create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const chunks: any[] = []
    doc.on("data", (chunk) => chunks.push(chunk))
    const endPromise = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))))

    // header
    doc.fontSize(20).text("Certificate of Completion", { align: "center" })
    doc.moveDown(1)

    doc.fontSize(14).text(`This is to certify that`, { align: "center" })
    doc.moveDown(0.5)
    doc.fontSize(18).text(enrollment.user.name || enrollment.user.email, { align: "center", underline: true })
    doc.moveDown(0.5)
    doc.fontSize(14).text(`has successfully completed the course`, { align: "center" })
    doc.moveDown(0.5)
    doc.fontSize(16).text(course.title, { align: "center", underline: true })
    doc.moveDown(1)

    doc.fontSize(12).text(`Instructor: ${course.instructor.name || course.instructor.email}`, { align: "left" })
    doc.text(`CPD Hours: ${course.cpdHours}`, { align: "left" })
    doc.text(`Completion Date: ${enrollment.completedAt ? enrollment.completedAt.toDateString() : new Date().toDateString()}`, { align: "left" })
    doc.text(`Certificate ID: ${certificateId}`, { align: "left" })

    // embed QR
    const qrImg = qrDataUrl.replace(/^data:image\/png;base64,/, "")
    const qrBuffer = Buffer.from(qrImg, "base64")
    doc.image(qrBuffer, doc.page.width - 150, doc.y - 20, { width: 100 })

    doc.moveDown(2)
    doc.fontSize(10).text("Verify this certificate at: " + verificationUrl, { align: "left" })

    doc.end()
    const pdfBuffer = await endPromise

    // update verificationUrl in DB
    await prisma.certificate.update({ where: { id: cert.id }, data: { verificationUrl } })

    // Buffer is a Uint8Array subclass; convert to Uint8Array for Response
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${certificateId}.pdf"`
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
