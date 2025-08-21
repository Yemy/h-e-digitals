import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { moduleId, title, description, timeLimit, randomOrder, questions } = body
    if (!moduleId || !title) return NextResponse.json({ error: 'moduleId and title required' }, { status: 400 })

    const module = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } })
    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

    if (session.user.role !== 'ADMIN' && session.user.id !== module.course.instructorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const quiz = await prisma.quiz.create({ data: { title, description, moduleId, courseId: module.courseId, timeLimit: Number(timeLimit || 0), randomOrder: !!randomOrder } })

    if (Array.isArray(questions)) {
      for (const q of questions) {
        const question = await prisma.question.create({ data: { question: q.question, type: q.type, points: q.points || 1, order: q.order || 0, quizId: quiz.id } })
        if (Array.isArray(q.options)) {
          for (const o of q.options) {
            await prisma.option.create({ data: { text: o.text, isCorrect: !!o.isCorrect, questionId: question.id } })
          }
        }
      }
    }

    return NextResponse.json({ quiz })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
