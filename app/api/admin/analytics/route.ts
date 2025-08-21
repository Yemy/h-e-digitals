import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // simple analytics: last 7 days revenue and enrollments
    const now = new Date()
    const series: any[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const start = new Date(d.setHours(0,0,0,0))
      const end = new Date(d.setHours(23,59,59,999))

      const revenue = await prisma.payment.aggregate({ where: { createdAt: { gte: start, lte: end }, status: 'COMPLETED' }, _sum: { amount: true } })
      const enrollments = await prisma.enrollment.count({ where: { enrolledAt: { gte: start, lte: end } } })

      series.push({ date: start.toISOString().slice(0,10), revenue: Number(revenue._sum.amount ?? 0), enrollments })
    }

    return NextResponse.json({ series })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
