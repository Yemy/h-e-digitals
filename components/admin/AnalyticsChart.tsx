"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function AnalyticsChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const d = await res.json()
        setData(d.series || [])
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          <Line type="monotone" dataKey="enrollments" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
