import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' }, include: { instructor: true }, take: 50 })

  return (
    <div>
      <h1 className="text-2xl font-bold">Course Approvals</h1>
      <div className="mt-4 space-y-3">
        {courses.map(c => (
          <div key={c.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.instructor.name || c.instructor.email} — {c.status}</div>
            </div>
            <div className="flex gap-2">
              <form method="post" action={`/api/admin/courses/approve`}>
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="bg-primary text-white px-3 py-1 rounded">Approve</button>
              </form>
              <Link href={`/admin/courses/${c.id}`} className="text-sm">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
