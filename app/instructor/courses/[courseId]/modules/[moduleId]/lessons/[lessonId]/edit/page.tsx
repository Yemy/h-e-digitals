"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function LessonEdit({ params }: any) {
  const { lessonId } = params
  const [lesson, setLesson] = useState<any>({ title: '', content: '', videoUrl: '' })

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/lessons/${lessonId}`)
      if (res.ok) setLesson(await res.json())
    }
    load()
  }, [lessonId])

  const save = async () => {
    const res = await fetch(`/api/lessons/${lessonId}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lesson) })
    if (res.ok) alert('Lesson saved')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Edit Lesson</h1>
      <div className="mt-4 space-y-3">
        <Input value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value })} placeholder="Lesson title" />
        <Input value={lesson.videoUrl} onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })} placeholder="Video URL (YouTube/Vimeo/iframe)" />
        <Textarea value={lesson.content} onChange={(e) => setLesson({ ...lesson, content: e.target.value })} placeholder="Lesson content / notes" />
        <div className="flex gap-2">
          <Button onClick={save}>Save Lesson</Button>
        </div>
      </div>
    </div>
  )
}
