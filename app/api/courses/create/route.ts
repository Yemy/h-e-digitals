import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, slug, description, categoryId, price, cpdHours, difficulty, modules } = body

    const course = await prisma.course.create({ data: {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      categoryId: categoryId || (await prisma.category.findFirst())?.id!,
      price: Number(price) || 0,
      cpdHours: Number(cpdHours) || 0,
      difficulty: difficulty || 'BEGINNER',
      instructorId: session.user.id,
      status: 'DRAFT'
    }})

    // create modules & lessons
    if (Array.isArray(modules)) {
      for (const m of modules) {
        const mod = await prisma.module.create({ data: { title: m.title || 'Module', description: m.description || '', order: 0, courseId: course.id } })
        if (Array.isArray(m.lessons)) {
          for (const l of m.lessons) {
            await prisma.lesson.create({ data: { title: l.title || 'Lesson', content: l.content || '', order: 0, moduleId: mod.id } })
          }
        }
      }
    }

    return NextResponse.json({ course })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
