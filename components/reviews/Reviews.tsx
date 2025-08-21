"use client"

import { useEffect, useState } from "react"

export default function Reviews({ courseId }: { courseId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch(`/api/courses/${courseId}/reviews`)
      if (res.ok) {
        const d = await res.json()
        setReviews(d.reviews || [])
      }
    }
    fetchReviews()
  }, [courseId])

  const submit = async () => {
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, rating, comment }) })
    if (res.ok) {
      const d = await res.json()
      setReviews(prev => [d.review, ...prev])
      setComment('')
    }
  }

  return (
    <div>
      <div className="p-3 border rounded mb-3">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Rating:</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border px-2">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="mt-2">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border p-2" />
        </div>
        <div className="mt-2">
          <button onClick={submit} className="bg-primary text-white px-3 py-1 rounded">Submit Review</button>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <div className="font-medium">{r.user?.name || r.user?.email}</div>
              <div className="text-sm">Rating: {r.rating}</div>
            </div>
            <div className="mt-2 text-sm">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
