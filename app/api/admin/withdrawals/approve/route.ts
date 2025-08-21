import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const w = await prisma.withdrawal.update({ where: { id }, data: { status: 'APPROVED', updatedAt: new Date() } })
    return NextResponse.json({ withdrawal: w })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
