"use client"

import { useEffect, useState } from "react"

export default function NotificationsDropdown() {
  const [notes, setNotes] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchNotes() {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notifications || [])
      }
    }
    fetchNotes()
  }, [])

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        Notifications
        {notes.length > 0 && <span className="ml-2 inline-block bg-red-500 text-white rounded-full px-2 text-xs">{notes.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow z-50">
          <div className="p-2">
            <h4 className="font-semibold">Notifications</h4>
          </div>
          <div className="max-h-64 overflow-auto">
            {notes.length === 0 && <div className="p-3 text-sm text-muted-foreground">No notifications</div>}
            {notes.map(n => (
              <div key={n.id} className="p-3 border-b">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
