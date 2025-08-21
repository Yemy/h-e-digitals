"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function Step1({ data, setData }: any) {
  return (
    <div className="space-y-3">
      <Input placeholder="Course title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      <Input placeholder="Slug" value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} />
      <select value={data.categoryId} onChange={(e) => setData({ ...data, categoryId: e.target.value })} className="w-full">
        <option value="">Select category</option>
        <option value="1">Healthcare</option>
        <option value="2">Business</option>
      </select>
      <Input placeholder="Price (USD)" type="number" value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} />
    </div>
  )
}

function Step2({ data, setData }: any) {
  return (
    <div className="space-y-3">
      <Textarea placeholder="Short description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
      <Input placeholder="CPD hours" type="number" value={data.cpdHours} onChange={(e) => setData({ ...data, cpdHours: Number(e.target.value) })} />
      <select value={data.difficulty} onChange={(e) => setData({ ...data, difficulty: e.target.value })} className="w-full">
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>
    </div>
  )
}

function Step3({ data, setData }: any) {
  const addModule = () => setData({ ...data, modules: [...data.modules, { title: 'New Module', lessons: [] }] })
  return (
    <div>
      <div className="space-y-3">
        {data.modules.map((m: any, idx: number) => (
          <div key={idx} className="p-2 border rounded">
            <Input value={m.title} onChange={(e) => {
              const copy = [...data.modules]; copy[idx].title = e.target.value; setData({ ...data, modules: copy })
            }} />
            <div className="mt-2">
              <Button size="sm" onClick={() => {
                const copy = [...data.modules]; copy[idx].lessons.push({ title: 'New Lesson' }); setData({ ...data, modules: copy })
              }}>Add Lesson</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Button onClick={addModule}>Add Module</Button>
      </div>
    </div>
  )
}

export default function CreateCoursePage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<any>({ title: '', slug: '', description: '', categoryId: '', price: 0, cpdHours: 0, difficulty: 'BEGINNER', modules: [] })

  const handleSubmit = async () => {
    const res = await fetch('/api/courses/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) alert('Course saved')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Create Course</h1>
      <div className="mt-4">
        {step === 1 && <Step1 data={data} setData={setData} />}
        {step === 2 && <Step2 data={data} setData={setData} />}
        {step === 3 && <Step3 data={data} setData={setData} />}
      </div>
      <div className="mt-4 flex gap-2">
        {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < 3 ? <Button onClick={() => setStep(step + 1)}>Next</Button> : <Button onClick={handleSubmit}>Save Course</Button>}
      </div>
    </div>
  )
}
