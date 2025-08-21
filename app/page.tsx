import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-gradient-to-br from-primary to-secondary text-white rounded-lg">
          <h1 className="text-3xl font-bold">CPD E-Training & Certification</h1>
          <p className="mt-4">Deliver professional development courses, assessments and certificates.</p>
          <div className="mt-6">
            <Link href="/courses" className="inline-block bg-white text-primary px-4 py-2 rounded">Browse Courses</Link>
          </div>
        </div>
        <div className="p-6 bg-card rounded-lg">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="mt-3 list-decimal list-inside">
            <li>Sign up / Sign in</li>
            <li>Enroll in a course</li>
            <li>Complete lessons and quizzes</li>
            <li>Download your certificate</li>
          </ol>
        </div>
      </section>
    </div>
  )
}
