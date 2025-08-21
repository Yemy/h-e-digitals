import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.formData()
    const role = body.get('role') as string
    if (!role) return NextResponse.json({ error: 'role required' }, { status: 400 })

    const updated = await prisma.user.update({ where: { id: params.id }, data: { role: role as any } })
    return NextResponse.json({ user: updated })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
