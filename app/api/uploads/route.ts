import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { filename, data } = await req.json()
    if (!filename || !data) return NextResponse.json({ error: 'filename and data required' }, { status: 400 })

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const buffer = Buffer.from(data, 'base64')
    const filePath = path.join(uploadsDir, path.basename(filename))
    await fs.promises.writeFile(filePath, buffer)

    const publicUrl = `/uploads/${path.basename(filename)}`
    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
