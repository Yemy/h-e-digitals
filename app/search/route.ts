import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category')
    const difficulty = url.searchParams.get('difficulty')

    const where: any = { status: 'PUBLISHED' }
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }]
    if (category) where.categoryId = category
    if (difficulty) where.difficulty = difficulty

    const results = await prisma.course.findMany({ where, include: { instructor: true, category: true } })
    return NextResponse.json({ results })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
