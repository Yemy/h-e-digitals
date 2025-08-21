import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

import Reviews from '@/components/reviews/Reviews'

interface Props { params: { slug: string } }

export default async function CourseDetail({ params }: Props) {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, include: { modules: { include: { lessons: true, quizzes: true } }, instructor: true, category: true } })
  if (!course) return <div>Course not found</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">{course.description}</p>

        <section className="mt-6">
          <h2 className="font-semibold">Reviews</h2>
          <Reviews courseId={course.id} />
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Modules</h2>
          <ul className="mt-3 space-y-2">
            {course.modules.map(m => (
              <li key={m.id} className="p-3 border rounded">
                <h3 className="font-medium">{m.title}</h3>
                <p className="text-sm">Lessons: {m.lessons.length} | Quizzes: {m.quizzes.length}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="p-4 border rounded">
        <p>Instructor: {course.instructor.name}</p>
        <p>CPD Hours: {course.cpdHours}</p>
        <p>Price: ${course.price}</p>
        <div className="mt-4">
          <form method="post" action="/api/enroll">
            <input type="hidden" name="courseId" value={course.id} />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Enroll</button>
          </form>
        </div>
      </aside>
    </div>
  )
}
