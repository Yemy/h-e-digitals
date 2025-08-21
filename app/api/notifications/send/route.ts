import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, title, message, link } = body
    if (!userId || !title || !message) return NextResponse.json({ error: 'userId, title and message required' }, { status: 400 })

    const note = await prisma.notification.create({ data: { userId, title, message, link, type: 'SYSTEM' } })

    // If SMTP env vars exist, attempt to send an email notification as well
    const smtpHost = process.env.SMTP_HOST
    if (smtpHost) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        })

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user?.email) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'no-reply@cpd.local',
            to: user.email,
            subject: title,
            text: message + (link ? `\n\nLink: ${link}` : ''),
          })
        }
      } catch (mailErr) {
        // ignore mail errors but log to console
        console.error('Mail send error', mailErr)
      }
    }

    return NextResponse.json({ notification: note })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
