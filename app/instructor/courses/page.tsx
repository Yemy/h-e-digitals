import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) redirect('/auth/signin')

  // only show courses for this instructor (admins see all)
  const where = session.user.role === 'ADMIN' ? {} : { instructorId: session.user.id }
  const courses = await prisma.course.findMany({ where, include: { modules: true } })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link href="/instructor/courses/create" className="text-primary">Create Course</Link>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(c => (
          <div key={c.id} className="p-4 border rounded">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.description?.slice(0,120) ?? ''}</p>
            <p className="text-sm mt-2">Modules: {c.modules.length}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/instructor/courses/${c.id}`} className="text-sm text-primary">Manage</Link>
              <form method="post" action={`/api/courses/${c.id}/publish`}>
                <button type="submit" className="text-sm">Toggle Publish</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
