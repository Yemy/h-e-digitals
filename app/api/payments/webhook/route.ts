import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" })

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || ""
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const tx = session.id
      const metadata: any = session.metadata || {}
      const courseId = metadata.courseId
      const userId = metadata.userId

      // update payment
      await prisma.payment.updateMany({ where: { transactionId: tx }, data: { status: "COMPLETED", updatedAt: new Date() } })

      // create enrollment automatically
      if (userId && courseId) {
        await prisma.enrollment.upsert({ where: { userId_courseId: { userId, courseId } }, update: {}, create: { userId, courseId } })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}
