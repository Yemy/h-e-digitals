import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Sum payments for courses where user is instructor
    const courses = await prisma.course.findMany({ where: { instructorId: session.user.id }, select: { id: true } })
    const courseIds = courses.map(c => c.id)
    const revenue = await prisma.payment.aggregate({ where: { courseId: { in: courseIds }, status: 'COMPLETED' }, _sum: { amount: true } })

    const withdrawals = await prisma.withdrawal.findMany({ where: { userId: session.user.id } })

    return NextResponse.json({ revenue: Number(revenue._sum.amount ?? 0), withdrawals })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
