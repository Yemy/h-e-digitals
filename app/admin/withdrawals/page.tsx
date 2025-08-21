import { prisma } from "@/lib/prisma"

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawal.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      <div className="mt-4 space-y-3">
        {withdrawals.map(w => (
          <div key={w.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{w.user.name || w.user.email} — ${w.amount}</div>
              <div className="text-sm text-muted-foreground">{w.method} — {w.status}</div>
            </div>
            <div>
              {w.status === 'PENDING' && (
                <form method="post" action="/api/admin/withdrawals/approve">
                  <input type="hidden" name="id" value={w.id} />
                  <button type="submit" className="bg-primary text-white px-3 py-1 rounded">Approve</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
