import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { courseId } = await req.json()
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 })

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const amount = Math.round((course.price || 0) * 100)

    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price_data: { currency: "usd", product_data: { name: course.title }, unit_amount: amount }, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payments/cancel`,
      metadata: { courseId, userId: session.user.id }
    })

    // create payment record as pending
    await prisma.payment.create({ data: { userId: session.user.id, courseId, amount: course.price, currency: "USD", status: "PENDING", provider: "STRIPE", transactionId: checkout.id, metadata: checkout as any } })

    return NextResponse.json({ url: checkout.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
