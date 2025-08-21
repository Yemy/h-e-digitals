import { prisma } from "@/lib/prisma"
import Link from "next/link"
import dynamic from "next/dynamic"

const AnalyticsChart = dynamic(() => import('@/components/admin/AnalyticsChart'), { ssr: false })

export default async function AdminPage() {
  const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
  const payments = await prisma.payment.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { user: true, course: true } })

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <section className="mt-4">
        <h2 className="font-semibold">Recent Users</h2>
        <ul className="mt-2 space-y-2">
          {users.map(u => (<li key={u.id} className="p-2 border rounded">{u.name || u.email} - {u.role}</li>))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="font-semibold">Recent Payments</h2>
        <ul className="mt-2 space-y-2">
          {payments.map(p => (<li key={p.id} className="p-2 border rounded">{p.user.email} paid {p.amount} for {p.course.title} - {p.status}</li>))}
        </ul>
      </section>
      <div className="mt-6">
        <h2 className="font-semibold mt-6">Analytics</h2>
        <div className="mt-3">
          <AnalyticsChart />
        </div>
        <div className="mt-4">
          <Link href="/admin/analytics" className="text-primary">Open analytics page</Link>
        </div>
      </div>
    </div>
  )
}
