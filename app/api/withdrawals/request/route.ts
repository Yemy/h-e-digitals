import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, method, details } = await req.json()
    if (!amount || !method) return NextResponse.json({ error: 'amount and method required' }, { status: 400 })

    const w = await prisma.withdrawal.create({ data: { userId: session.user.id, amount: Number(amount), method, details: details || {} } })
    return NextResponse.json({ withdrawal: w })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
