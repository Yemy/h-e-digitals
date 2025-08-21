import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notes = await prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ notifications: notes })
}

export async function POST(req: Request) {
  // create a notification (could be admin or system)
  const { userId, title, message, link } = await req.json()
  const note = await prisma.notification.create({ data: { userId, title, message, link, type: 'SYSTEM' } })
  return NextResponse.json({ notification: note })
}
