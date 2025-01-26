"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Loader2, StopCircle, Music, Calendar } from "lucide-react"
import Link from "next/link"

import { musicApiService } from "../services/musicApi"
import { IdentifiedSong } from "../identified-song"
import { SamplesGrid } from "./samples-grid"
import { useAudioRecorder } from "../hooks/useAudioRecorder"
import { useSongContext } from "../contexts/SongContext"

export default function MusicAnalyzer() {
  const { analyzedSong, setAnalyzedSong, identifiedSamples, setIdentifiedSamples } = useSongContext()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    try {
      const song = await musicApiService.identifySong(audioBlob)
      setAnalysisProgress(50)
      setAnalyzedSong(song)
      const samples = await musicApiService.analyzeSamples(song.song, song.artist)
      setAnalysisProgress(100)
      setIdentifiedSamples(samples)
    } catch (error) {
      console.error("Error analyzing audio:", error)
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(handleRecordingComplete)

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
          {analyzedSong && <IdentifiedSong song={analyzedSong} />}
          {identifiedSamples.length > 0 && <SamplesGrid samples={identifiedSamples} />}
        </CardContent>
      </Card>
    </div>
  )
} 