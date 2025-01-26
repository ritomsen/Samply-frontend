"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

type Song = {
  song: string
  artist: string
  img_url: string
}

type Sample = {
  song: string
  artist: string
  year: string
}

type SongContextType = {
  analyzedSong: Song | null
  setAnalyzedSong: (song: Song | null) => void
  identifiedSamples: Sample[]
  setIdentifiedSamples: (samples: Sample[]) => void
}

const SongContext = createContext<SongContextType | undefined>(undefined)

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [analyzedSong, setAnalyzedSong] = useState<Song | null>(null)
  const [identifiedSamples, setIdentifiedSamples] = useState<Sample[]>([])

  return (
    <SongContext.Provider value={{ analyzedSong, setAnalyzedSong, identifiedSamples, setIdentifiedSamples }}>
      {children}
    </SongContext.Provider>
  )
}

export function useSongContext() {
  const context = useContext(SongContext)
  if (context === undefined) {
    throw new Error("useSongContext must be used within a SongProvider")
  }
  return context
}

