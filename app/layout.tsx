import "./globals.css"
import { ReactNode } from "react"
import Providers from "./providers"
import NavBar from "@/components/navbar"

export const metadata = {
  title: 'CPD E-Training',
  description: 'Continuing Professional Development Platform',
}

export default function RootLayout({ children, }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <main className="container py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
