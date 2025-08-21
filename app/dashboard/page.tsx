import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any)

  if (!session?.user) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p>Please <Link href="/auth/signin">sign in</Link> to access your dashboard.</p>
      </div>
    )
  }

  const role = session.user.role

  return (
    <div>
      <h2 className="text-xl font-semibold">{role} Dashboard</h2>
      {role === 'STUDENT' && (
        <div className="mt-4">
          <p>Your enrolled courses and certificates will appear here.</p>
          <Link href="/courses" className="text-sm text-primary">Browse courses</Link>
        </div>
      )}
      {role === 'INSTRUCTOR' && (
        <div className="mt-4">
          <p>Create and manage your courses.</p>
          <Link href="/instructor/dashboard" className="text-sm text-primary">Instructor Dashboard</Link>
        </div>
      )}
      {role === 'ADMIN' && (
        <div className="mt-4">
          <p>Admin controls: users, courses, payments, analytics.</p>
          <Link href="/admin" className="text-sm text-primary">Admin Panel</Link>
        </div>
      )}
    </div>
  )
}
