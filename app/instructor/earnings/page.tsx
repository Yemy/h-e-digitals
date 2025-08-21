import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function InstructorEarningsPage() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) redirect('/auth/signin')

  const instructorId = session.user.id

  // sum of completed payments for instructor's courses
  const payments = await prisma.payment.findMany({ where: { status: 'COMPLETED', course: { instructorId } }, include: { course: true } })
  const total = payments.reduce((s, p) => s + (p.amount || 0), 0)

  const withdrawals = await prisma.withdrawal.findMany({ where: { userId: instructorId }, orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1 className="text-2xl font-bold">Earnings</h1>
      <div className="mt-4 p-4 border rounded">
        <div className="text-sm">Total Earned</div>
        <div className="text-2xl font-semibold">${total.toFixed(2)}</div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Payments</h2>
        <ul className="mt-2 space-y-2">
          {payments.map(p => (
            <li key={p.id} className="p-2 border rounded">{p.userId} - ${p.amount} for {p.course.title} - {p.status}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Withdrawals</h2>
        <form method="post" action="/api/withdrawals/request" className="mt-2 flex gap-2">
          <input name="amount" type="number" placeholder="Amount" className="border p-2 rounded" />
          <select name="method" className="border p-2 rounded">
            <option value="BANK">Bank</option>
            <option value="MPESA">MPESA</option>
          </select>
          <button type="submit" className="px-3 py-2 bg-primary text-white rounded">Request Withdrawal</button>
        </form>

        <ul className="mt-4 space-y-2">
          {withdrawals.map(w => (
            <li key={w.id} className="p-2 border rounded">${w.amount} - {w.status} - {new Date(w.createdAt).toLocaleString()}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
