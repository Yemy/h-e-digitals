import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

interface Props { params: { slug: string, moduleId: string, lessonId: string } }

export default async function LessonPage({ params }: Props) {
  const lesson = await prisma.lesson.findUnique({ where: { id: params.lessonId }, include: { module: { include: { course: true } } } })
  if (!lesson) return <div>Lesson not found</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <div className="mt-4">
          {lesson.videoUrl ? (
            <iframe src={lesson.videoUrl} className="w-full h-64" />
          ) : (
            <div className="p-4 border">No video available</div>
          )}
        </div>
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-semibold">Lesson content</h2>
          <p className="mt-2">{lesson.content}</p>
        </div>
      </div>
      <aside className="p-4 border rounded">
        <h3 className="font-medium">Module: {lesson.module.title}</h3>
        <div className="mt-4">
          <form action="/api/progress" method="post">
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input type="hidden" name="completed" value={"true"} />
            <button type="submit" className="bg-primary text-white px-3 py-1 rounded">Mark Completed</button>
          </form>
        </div>
      </aside>
    </div>
  )
}
