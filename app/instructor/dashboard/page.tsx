import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import Link from "next/link"

export default async function InstructorDashboard() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) return <div>Please sign in</div>

  return (
    <div>
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <p className="mt-3">Welcome, {session.user.name}</p>
      <div className="mt-4 space-y-2">
        <Link href="/instructor/courses/create" className="text-primary">Create Course</Link>
        <Link href="/instructor/courses" className="text-primary">My Courses</Link>
      </div>
    </div>
  )
}
