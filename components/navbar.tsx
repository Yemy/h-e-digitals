"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white/50 backdrop-blur sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold">CPD Platform</Link>
          <nav className="hidden md:flex gap-2">
            <Link href="/courses" className="text-sm">Courses</Link>
            <Link href="/dashboard" className="text-sm">Dashboard</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NotificationsDropdown />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{session.user.name || session.user.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
            </div>
          ) : (
            <Link href="/auth/signin"><Button size="sm">Sign in</Button></Link>
          )}
        </div>
      </div>
    </header>
  )
}
