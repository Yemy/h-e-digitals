import { prisma } from "@/lib/prisma"
import QuizComponent from "@/components/quiz/quiz"

interface Props { params: { slug: string, moduleId: string, quizId: string } }

export default async function QuizPage({ params }: Props) {
  const quiz = await prisma.quiz.findUnique({ where: { id: params.quizId }, include: { questions: { include: { options: true } } } })
  if (!quiz) return <div>Quiz not found</div>

  return (
    <div>
      <QuizComponent quiz={quiz} />
    </div>
  )
}
