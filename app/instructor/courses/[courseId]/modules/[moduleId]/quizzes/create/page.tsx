"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CreateQuiz({ params }: any) {
  const { moduleId } = params
  const [quiz, setQuiz] = useState<any>({ title: '', description: '', timeLimit: 0, randomOrder: false, questions: [] })

  const addQuestion = () => setQuiz((q: any) => ({ ...q, questions: [...q.questions, { question: '', type: 'MCQ', points: 1, options: [{ text: '', isCorrect: false }] }] }))

  const save = async () => {
    const res = await fetch(`/api/quizzes/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...quiz, moduleId }) })
    if (res.ok) {
      alert('Quiz created')
      setQuiz({ title: '', description: '', timeLimit: 0, randomOrder: false, questions: [] })
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Create Quiz</h1>
      <div className="mt-4 space-y-3">
        <Input placeholder="Quiz title" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
        <Textarea placeholder="Description" value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
        <div className="mt-2">
          <h3 className="font-semibold">Questions</h3>
          <div className="space-y-2 mt-2">
            {quiz.questions.map((q: any, idx: number) => (
              <div key={idx} className="p-2 border rounded">
                <Input placeholder="Question text" value={q.question} onChange={(e) => { const copy = [...quiz.questions]; copy[idx].question = e.target.value; setQuiz({ ...quiz, questions: copy }) }} />
                <div className="mt-2">Options:</div>
                {q.options.map((opt: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center mt-2">
                    <input type="checkbox" checked={opt.isCorrect} onChange={(e) => { const copy = [...quiz.questions]; copy[idx].options[i].isCorrect = e.target.checked; setQuiz({ ...quiz, questions: copy }) }} />
                    <Input value={opt.text} onChange={(e) => { const copy = [...quiz.questions]; copy[idx].options[i].text = e.target.value; setQuiz({ ...quiz, questions: copy }) }} />
                  </div>
                ))}
                <div className="mt-2">
                  <Button size="sm" onClick={() => { const copy = [...quiz.questions]; copy[idx].options.push({ text: '', isCorrect: false }); setQuiz({ ...quiz, questions: copy }) }}>Add Option</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Button onClick={addQuestion}>Add Question</Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={save}>Save Quiz</Button>
        </div>
      </div>
    </div>
  )
}
