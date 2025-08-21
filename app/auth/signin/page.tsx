"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <div className="mt-4 space-y-3">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={() => signIn('credentials', { email, password, callbackUrl: '/dashboard' })}>Sign in</Button>
          <Button variant="outline" onClick={() => signIn('google')}>Sign in with Google</Button>
        </div>
      </div>
    </div>
  )
}
