'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Loader2, StopCircle } from 'lucide-react'

// Placeholder functions for backend processes
const identifySong = async (audioBlob: Blob): Promise<{ title: string, artist: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  return { title: "Never Gonna Give You Up", artist: "Rick Astley" }
}

const analyzeSamples = async (songId: string): Promise<string[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  return ["Disco drum loop", "Synth bass", "Piano riff"]
}

export default function MusicAnalyzer() {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [identifiedSong, setIdentifiedSong] = useState<{ title: string, artist: string } | null>(null)
  const [samples, setSamples] = useState<string[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setIsAnalyzing(true)
        setAnalysisProgress(0)
        try {
          const song = await identifySong(audioBlob)
          setAnalysisProgress(50)
          setIdentifiedSong(song)
          const sampleList = await analyzeSamples(song.title)
          setAnalysisProgress(100)
          setSamples(sampleList)
        } catch (error) {
          console.error('Error analyzing audio:', error)
        } finally {
          setIsAnalyzing(false)
          setAnalysisProgress(0)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      setIdentifiedSong(null)
      setSamples([])
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Music Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button 
              onClick={handleToggleRecording} 
              className={`w-20 h-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isAnalyzing}
            >
              {isRecording ? (
                <StopCircle className="h-10 w-10" />
              ) : isAnalyzing ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-center">Analyzing...</div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}

          {identifiedSong && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Identified Song:</h3>
              <p>{identifiedSong.title} by {identifiedSong.artist}</p>
            </div>
          )}

          {samples.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Samples Used:</h3>
              <ul className="list-disc pl-5">
                {samples.map((sample, index) => (
                  <li key={index}>{sample}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

