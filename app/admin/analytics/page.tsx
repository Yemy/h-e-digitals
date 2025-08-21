import dynamic from "next/dynamic"

const AnalyticsChart = dynamic(() => import('@/components/admin/AnalyticsChart'), { ssr: false })

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="mt-4">
        <AnalyticsChart />
      </div>
    </div>
  )
}
