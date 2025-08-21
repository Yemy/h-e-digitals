import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { lessonId, completed } = body
    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 })

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } })
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      update: { completed: !!completed, updatedAt: new Date() },
      create: { userId: session.user.id, lessonId, completed: !!completed, completedAt: completed ? new Date() : null }
    })

    // Recalculate module/course progress for the enrollment
    const moduleLessons = await prisma.lesson.count({ where: { moduleId: lesson.moduleId } })
    const completedLessons = await prisma.progress.count({ where: { lesson: { moduleId: lesson.moduleId }, userId: session.user.id, completed: true } })
    const moduleProgress = moduleLessons === 0 ? 0 : Math.round((completedLessons / moduleLessons) * 100)

    // update enrollment progress (simple approach: average across modules by lessons)
    const courseLessons = await prisma.lesson.count({ where: { module: { courseId: lesson.module.courseId } } })
    const totalCompleted = await prisma.progress.count({ where: { lesson: { module: { courseId: lesson.module.courseId } } , userId: session.user.id, completed: true } })
    const courseProgress = courseLessons === 0 ? 0 : Math.round((totalCompleted / courseLessons) * 100)

    await prisma.enrollment.updateMany({ where: { courseId: lesson.module.courseId, userId: session.user.id }, data: { progress: courseProgress, completedAt: courseProgress >= 100 ? new Date() : undefined } })

    return NextResponse.json({ progress, moduleProgress, courseProgress })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
