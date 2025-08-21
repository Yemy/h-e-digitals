import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const module = await prisma.module.findUnique({ where: { id: params.id } })
    if (!module) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const course = await prisma.course.findUnique({ where: { id: module.courseId } })
    if (session.user.role !== 'ADMIN' && session.user.id !== course?.instructorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updated = await prisma.module.update({ where: { id: params.id }, data: { title: body.title, description: body.description } })
    return NextResponse.json({ module: updated })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
