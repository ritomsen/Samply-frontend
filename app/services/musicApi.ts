import { Song, Sample } from "../types/music"

export const musicApiService = {
  async identifySong(audioBlob: Blob): Promise<Song> {
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
    return { song: data.song, artist: data.artist, img_url: data.img_url }
  },

  async analyzeSamples(song: string, artist: string): Promise<Sample[]> {
    const response = await fetch(
      `http://localhost:8000/music/scrape-samples/?song_title=${song}&artist=${artist}`,
      { method: "GET" }
    )
    if (!response.ok) {
      throw new Error(`Error fetching samples: ${response.status} - ${response.statusText}`)
    }
    const { samples } = await response.json()
    return samples
  }
} 