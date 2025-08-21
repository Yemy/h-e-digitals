import { prisma } from "@/lib/prisma"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })

  return (
    <div>
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-4 space-y-3">
        {users.map(u => (
          <div key={u.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm text-muted-foreground">{u.email} — {u.role}</div>
            </div>
            <form method="post" action={`/api/admin/users/${u.id}/role`}>
              <select name="role" defaultValue={u.role} className="mr-2">
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="bg-primary text-white px-3 py-1 rounded">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
