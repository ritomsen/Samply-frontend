"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const navItems = [
  { name: "Analyze", value: "analyze" },
  { name: "Library", value: "library" },
  { name: "Playlists", value: "playlists" },
  { name: "Chat", value: "chat" },
]

interface LayoutProps {
  children: ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isConnected, setIsConnected] = useState(false)

  const handleSpotifyConnect = () => {
    // Redirect the browser to the Spotify login endpoint
    window.location.href = "http://localhost:8000/spotify/login"
    
  }

  useEffect(() => {
    const checkSpotifyLogin = async () => {
      // Including credentials ensures cookies (like session info) are sent along
      const response = await fetch("http://localhost:8000/spotify/check-login", { credentials: "include" })
      const data = await response.json()
      setIsConnected(data.isConnected)

      // Note: In development, React 18 Strict Mode may call this effect twice, which is expected and will not occur in production.
    }
    checkSpotifyLogin()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-xl">
            <TabsList>
              {navItems.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button onClick={handleSpotifyConnect} disabled={isConnected} variant={isConnected ? "outline" : "default"}>
            {isConnected ? "Connected to Spotify" : "Connect to Spotify"}
          </Button>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}