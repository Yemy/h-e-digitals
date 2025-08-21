"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ModuleEdit({ params }: any) {
  const { courseId, moduleId } = params
  const [module, setModule] = useState<any>({ title: '', description: '', lessons: [] })

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/modules/${moduleId}`)
      if (res.ok) setModule(await res.json())
    }
    load()
  }, [moduleId])

  const addLesson = () => setModule((m: any) => ({ ...m, lessons: [...(m.lessons||[]), { title: 'New Lesson' }] }))

  const save = async () => {
    const res = await fetch(`/api/modules/${moduleId}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(module) })
    if (res.ok) alert('Saved')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Edit Module</h1>
      <div className="mt-4 space-y-3">
        <Input value={module.title} onChange={(e) => setModule({ ...module, title: e.target.value })} placeholder="Module title" />
        <Textarea value={module.description} onChange={(e) => setModule({ ...module, description: e.target.value })} placeholder="Module description" />

        <div>
          <h3 className="font-semibold">Lessons</h3>
          <div className="mt-2 space-y-2">
            {(module.lessons || []).map((l: any, idx: number) => (
              <div key={idx} className="p-2 border rounded flex items-center gap-2">
                <Input value={l.title} onChange={(e) => { const copy = [...module.lessons]; copy[idx].title = e.target.value; setModule({ ...module, lessons: copy }) }} />
                <Button variant="outline" size="sm" onClick={async () => {
                  // create lesson server-side
                  const res = await fetch(`/api/lessons/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moduleId, title: l.title }) })
                  if (res.ok) alert('Lesson created')
                }}>Save</Button>
              </div>
            ))}
          </div>
          <div className="mt-2"><Button onClick={addLesson}>Add Lesson</Button></div>
        </div>

        <div className="flex gap-2">
          <Button onClick={save}>Save Module</Button>
          <Button variant="destructive" onClick={async () => {
            const res = await fetch(`/api/modules/${moduleId}/delete`, { method: 'POST' })
            if (res.ok) window.location.href = `/instructor/courses/${courseId}`
          }}>Delete Module</Button>
        </div>
      </div>
    </div>
  )
}
