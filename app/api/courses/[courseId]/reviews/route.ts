import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = params.courseId
    const reviews = await prisma.review.findMany({ where: { courseId }, include: { user: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ reviews })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
