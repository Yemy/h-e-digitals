import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const cid = url.searchParams.get("cid")
    if (!cid) return NextResponse.json({ error: "cid required" }, { status: 400 })

    const cert = await prisma.certificate.findUnique({ where: { certificateId: cid }, include: { user: true, course: true } })
    if (!cert) return NextResponse.json({ valid: false, message: "Certificate not found" }, { status: 404 })

    return NextResponse.json({ valid: true, certificate: { id: cert.certificateId, name: cert.user.name || cert.user.email, course: cert.course.title, cpdHours: cert.cpdHours, issuedAt: cert.issuedAt } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
