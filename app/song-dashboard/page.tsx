"use client"

import dynamic from "next/dynamic"

const SongDashboard = dynamic(() => import("../components/song-dashboard"), { ssr: false })

export default function SongDashboardPage() {
  return <SongDashboard />
}

