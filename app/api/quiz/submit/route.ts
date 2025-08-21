import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { quizId, answers } = body // answers: [{ questionId, answer }]
    if (!quizId || !answers) return NextResponse.json({ error: "quizId and answers required" }, { status: 400 })

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: { include: { options: true } } } })
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 })

    let totalPoints = 0
    let earned = 0

    for (const q of quiz.questions) {
      totalPoints += q.points
      const submitted = answers.find((a: any) => a.questionId === q.id)
      if (!submitted) continue

      if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
        const correctOption = q.options.find(o => o.isCorrect)
        if (correctOption && String(submitted.answer) === String(correctOption.id)) {
          earned += q.points
        }
      } else if (q.type === "FILL_BLANK") {
        // simple text match
        const correctOption = q.options.find(o => o.isCorrect)
        if (correctOption && String(submitted.answer).trim().toLowerCase() === String(correctOption.text).trim().toLowerCase()) {
          earned += q.points
        }
      }
    }

    const score = totalPoints === 0 ? 0 : Math.round((earned / totalPoints) * 100)
    const passed = score >= (quiz.passScore ?? 80)

    // determine attempt number
    const attemptsCount = await prisma.quizAttempt.count({ where: { quizId, userId: session.user.id } })

    const attempt = await prisma.quizAttempt.create({ data: {
      quizId,
      userId: session.user.id,
      score,
      passed,
      answers: answers as any,
      attemptNumber: attemptsCount + 1
    }})

    return NextResponse.json({ attempt })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
