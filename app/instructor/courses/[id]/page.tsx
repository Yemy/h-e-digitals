import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props { params: { id: string } }

export default async function InstructorCourseManage({ params }: Props) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) return <div>Please sign in</div>

  const course = await prisma.course.findUnique({ where: { id: params.id }, include: { modules: { include: { lessons: true, quizzes: true } } , instructor: true } })
  if (!course) return <div>Course not found</div>

  if (session.user.role !== 'ADMIN' && session.user.id !== course.instructorId) {
    return <div>Forbidden</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage: {course.title}</h1>
        <form method="post" action={`/api/courses/${course.id}/publish`}>
          <button type="submit" className="px-3 py-1 rounded bg-primary text-white">{course.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
        </form>
      </div>

      <section className="mt-4">
        <h2 className="font-semibold">Modules</h2>
        <div className="mt-3 space-y-3">
          {course.modules.map(m => (
            <div key={m.id} className="p-3 border rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm">Lessons: {m.lessons.length} | Quizzes: {m.quizzes.length}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Link href={`/instructor/courses/${course.id}/modules/${m.id}/edit`} className="text-sm text-primary">Edit</Link>
                  <form method="post" action={`/api/modules/${m.id}/delete`}>
                    <button type="submit" className="text-sm">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
