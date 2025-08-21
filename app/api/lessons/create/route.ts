import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const moduleId = body.moduleId as string
    const title = body.title as string
    if (!moduleId || !title) return NextResponse.json({ error: 'moduleId and title required' }, { status: 400 })

    const module = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } })
    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

    if (session.user.role !== 'ADMIN' && session.user.id !== module.course.instructorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const order = (await prisma.lesson.count({ where: { moduleId } })) + 1
    const lesson = await prisma.lesson.create({ data: { title: title as string, module: { connect: { id: moduleId as string } }, order } })
    return NextResponse.json({ lesson })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
