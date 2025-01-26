"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Loader2, StopCircle, Music, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSongContext } from "../contexts/SongContext"

// Placeholder functions for backend processes
const identifySong = async (audioBlob: Blob): Promise<{ song: string; artist: string; img_url: string }> => {
  const formData = new FormData()

  formData.append("file", audioBlob, "recorded_audio.wav")

  const response = await fetch("http://localhost:8000/music/", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Error identifying song: ${response.status} - ${response.statusText}`)
  }
  const data = await response.json()

  const { song, artist, img_url } = data
  console.log(data)
  return { song: song, artist: artist, img_url: img_url }
}

const analyzeSamples = async (
  song: string,
  artist: string,
): Promise<{ song: string; artist: string; year: string }[]> => {
  const response = await fetch(`http://localhost:8000/music/scrape-samples/?song_title=${song}&artist=${artist}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error(`Error fetching samples: ${response.status} - ${response.statusText}`)
  }
  const data = await response.json()
  const { samples } = data
  console.log(data)
  return samples
}

export default function MusicAnalyzer() {
  const { analyzedSong, setAnalyzedSong, identifiedSamples, setIdentifiedSamples } = useSongContext()
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null)


  const stopRecording = useCallback(() => {

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Stop all tracks in the stream
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (stopTimerRef.current) {

      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setIsAnalyzing(true)
        setAnalysisProgress(0)
        try {
          const res = await identifySong(audioBlob)
          setAnalysisProgress(50)
          setAnalyzedSong(res)
          const samples = await analyzeSamples(res.song, res.artist)
          setAnalysisProgress(100)
          setIdentifiedSamples(samples)
        } catch (error) {
          console.error("Error analyzing audio:", error)
        } finally {
          setIsAnalyzing(false)
          setAnalysisProgress(0)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      stopTimerRef.current = setTimeout(() => {
        stopRecording()
      }, 5000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }, [setAnalyzedSong, setIdentifiedSamples, stopRecording])

 

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      setAnalyzedSong(null)
      setIdentifiedSamples([])
      startRecording()
    }
  }

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setAnalysisProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            return 100
          }
          return prevProgress + 1
        })
      }, 50)

      return () => clearInterval(timer)
    }
  }, [isAnalyzing])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Music Analyzer</CardTitle>
          <CardDescription className="text-center">Record a song to identify and analyze its samples</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleToggleRecording}
              className={`w-24 h-24 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={isAnalyzing}
            >
              {isRecording ? (
                <StopCircle className="h-12 w-12" />
              ) : isAnalyzing ? (
                <Loader2 className="h-12 w-12 animate-spin" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-center text-lg font-semibold">Analyzing...</div>
              <Progress value={analysisProgress} className="w-full h-2" />
            </div>
          )}

          {analyzedSong && (
            <div className="flex justify-center mt-4">
              <Link href="/song-dashboard">
                <Button variant="outline">See More Info</Button>
              </Link>
            </div>
          )}

          {analyzedSong && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Identified Song</h3>
              <div className="flex items-center space-x-6 bg-gray-100 p-4 rounded-lg">
                <div className="w-32 h-32 relative">
                  <Image
                    src={analyzedSong.img_url || "/placeholder.svg"}
                    alt={`${analyzedSong.song} by ${analyzedSong.artist}`}
                    fill={true}
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{analyzedSong.song}</h4>
                  <p className="text-gray-600">{analyzedSong.artist}</p>
                </div>
              </div>
            </div>
          )}

          {identifiedSamples.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Samples Used</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identifiedSamples.map((sample, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Music className="h-6 w-6 text-blue-500" />
                        <div>
                          <h5 className="font-semibold">{sample.song}</h5>
                          <p className="text-sm text-gray-600">{sample.artist}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{sample.year}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

