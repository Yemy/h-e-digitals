import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const id = body.get('id') as string
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const course = await prisma.course.update({ where: { id }, data: { status: 'PUBLISHED' } })
    return NextResponse.json({ course })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
