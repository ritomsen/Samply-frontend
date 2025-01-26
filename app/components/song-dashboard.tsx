"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Music, Calendar, Clock, Mic, Headphones, BarChart2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSongContext } from "../contexts/SongContext"
import { SamplesGrid } from "./samples-grid"

export default function SongDashboard() {
  const { analyzedSong, identifiedSamples } = useSongContext()

  // Placeholder data for additional information
  const additionalInfo = {
    duration: "3:42",
    genre: "Pop",
    releaseDate: "1987-07-27",
    bpm: 113,
    key: "A Major",
    energy: 0.8,
    danceability: 0.7,
  }

  if (!analyzedSong) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analyzer
          </Button>
        </Link>
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <p className="text-center">No song data available. Please analyze a song first.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-3xl font-bold">Song Details</CardTitle>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analyzer
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-48 h-48 relative">
              <Image
                src={analyzedSong.img_url || "/placeholder.svg"}
                alt={`${analyzedSong.song} by ${analyzedSong.artist}`}
                fill={true}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-semibold">{analyzedSong.song}</h2>
              <p className="text-2xl text-gray-600">{analyzedSong.artist}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{additionalInfo.duration}</span>
                </div>
                <div className="flex items-center">
                  <Music className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{additionalInfo.genre}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{additionalInfo.releaseDate}</span>
                </div>
                <div className="flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{additionalInfo.bpm} BPM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mic className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-semibold">Key</span>
                  </div>
                  <span>{additionalInfo.key}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-semibold">Energy</span>
                  </div>
                  <span>{additionalInfo.energy * 100}%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-semibold">Danceability</span>
                  </div>
                  <span>{additionalInfo.danceability * 100}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {identifiedSamples.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 mx-auto text-center">Samples Used</h3>
              <SamplesGrid samples={identifiedSamples} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

