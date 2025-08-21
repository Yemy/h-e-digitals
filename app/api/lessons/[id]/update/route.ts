import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const lesson = await prisma.lesson.findUnique({ where: { id: params.id }, include: { module: { include: { course: true } } } })
    if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (session.user.role !== 'ADMIN' && session.user.id !== lesson.module.course.instructorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updated = await prisma.lesson.update({ where: { id: params.id }, data: { title: body.title, content: body.content, videoUrl: body.videoUrl, duration: body.duration } })
    return NextResponse.json({ lesson: updated })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
