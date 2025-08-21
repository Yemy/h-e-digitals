import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { courseId } = body
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 })

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    // If course is paid, ensure a successful payment exists
    if (course.price > 0) {
      const payment = await prisma.payment.findFirst({ where: { courseId, userId: session.user.id, status: "COMPLETED" } })
      if (!payment) return NextResponse.json({ error: "Payment required" }, { status: 402 })
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: {},
      create: { userId: session.user.id, courseId }
    })

    return NextResponse.json({ enrollment })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
