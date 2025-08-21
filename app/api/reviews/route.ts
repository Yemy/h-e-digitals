import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId, rating, comment } = await req.json()
    if (!courseId || !rating) return NextResponse.json({ error: 'courseId and rating required' }, { status: 400 })

    const review = await prisma.review.upsert({ where: { userId_courseId: { userId: session.user.id, courseId } }, update: { rating, comment }, create: { userId: session.user.id, courseId, rating, comment } })

    return NextResponse.json({ review })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
