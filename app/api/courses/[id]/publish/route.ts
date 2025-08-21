import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const courseId = params.id
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Only instructor or admin can toggle publish
    if (session.user.role !== 'ADMIN' && session.user.id !== course.instructorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const updated = await prisma.course.update({ where: { id: courseId }, data: { status: newStatus } })
    return NextResponse.json({ course: updated })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
