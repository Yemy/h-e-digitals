import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ where: { status: 'PUBLISHED' }, include: { instructor: true, category: true } })

  return (
    <div>
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(c => (
          <div key={c.id} className="p-4 border rounded">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.description.slice(0,120)}...</p>
            <p className="text-sm mt-2">Instructor: {c.instructor.name}</p>
            <div className="mt-3">
              <Link href={`/courses/${c.slug}`} className="text-primary">View course</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
