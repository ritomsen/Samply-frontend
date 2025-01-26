import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SongProvider } from "./contexts/SongContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Music Analyzer",
  description: "Analyze and identify songs and their samples",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SongProvider>{children}</SongProvider>
      </body>
    </html>
  )
}

