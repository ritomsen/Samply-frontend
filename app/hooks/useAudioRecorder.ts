import { useState, useRef, useCallback } from "react"

export function useAudioRecorder(onRecordingComplete: (blob: Blob) => Promise<void>) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null)

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      const stream = mediaRecorderRef.current.stream
      stream.getTracks().forEach(track => track.stop())
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
  }, [])

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
        await onRecordingComplete(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      stopTimerRef.current = setTimeout(stopRecording, 5000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }, [onRecordingComplete, stopRecording])

  return {
    isRecording,
    startRecording,
    stopRecording
  }
} 