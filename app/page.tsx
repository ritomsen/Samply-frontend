"use client"

import { useState } from "react"
import Layout from "./components/layout"
import MusicAnalyzer from "./components/music-analyzer"
import SongDashboard from "./components/song-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SongProvider } from "./contexts/SongContext"

export default function Home() {
  const [activeTab, setActiveTab] = useState("analyze")
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputText, setInputText] = useState("")

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }])
      setInputText("")
      // Here you would typically send the message to a backend API
      // and then add the response to the messages array
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "This is a placeholder response.", isUser: false }])
      }, 1000)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "analyze":
        return <MusicAnalyzer setActiveTab={setActiveTab} />
      case "song-dashboard":
        return <SongDashboard setActiveTab={setActiveTab} />
      case "library":
        return (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardHeader>
                <CardTitle>Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your music library will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        )
      case "playlists":
        return (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardHeader>
                <CardTitle>Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your playlists will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        )
      case "chat":
        return (
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Chat with Music Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] mb-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}>
                      <span
                        className={`inline-block p-2 rounded-lg ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        {message.text}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SongProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </SongProvider>
  )
}
// "use client"

// import dynamic from "next/dynamic"

// const MusicAnalyzer = dynamic(() => import("./components/music-analyzer"), { ssr: false })

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <MusicAnalyzer />
//     </main>
//   )
// }


