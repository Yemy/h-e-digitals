"use client"

import { useEffect, useMemo, useState } from "react"

export default function Quiz({ quiz }: { quiz: any }) {
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!quiz) return
    let qs = [...quiz.questions]
    if (quiz.randomOrder) qs = qs.sort(() => Math.random() - 0.5)
    setQuestions(qs)
    setAnswers(qs.map(q => ({ questionId: q.id, answer: null })))
      const init = () => {
        if (quiz.timeLimit) setTimeLeft(quiz.timeLimit)
      }
      init()
  }, [quiz])

  useEffect(() => {
    if (timeLeft == null) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const t = setInterval(() => setTimeLeft(v => (v == null ? null : v - 1)), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  const handleChange = (qid: string, value: any) => {
    setAnswers(a => a.map(x => x.questionId === qid ? { ...x, answer: value } : x))
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/quiz/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizId: quiz.id, answers }) })
    const data = await res.json()
    if (res.ok) alert('Submitted: ' + JSON.stringify(data.attempt))
    else alert('Error: ' + JSON.stringify(data))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{quiz.title}</h2>
        {timeLeft != null && <div className="text-sm">Time left: {timeLeft}s</div>}
      </div>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-3 border rounded">
            <div className="font-medium">{idx + 1}. {q.question}</div>
            <div className="mt-2 space-y-2">
              {q.options.map((opt: any) => (
                <label key={opt.id} className="flex items-center gap-2">
                  <input type="radio" name={q.id} value={opt.id} onChange={() => handleChange(q.id, opt.id)} />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit Quiz</button>
      </div>
    </div>
  )
}
