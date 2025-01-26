import Image from "next/image"
import { Song } from "./types/music"

interface IdentifiedSongProps {
  song: Song
}

export function IdentifiedSong({ song }: IdentifiedSongProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Identified Song</h3>
      <div className="flex items-center space-x-6 bg-gray-100 p-4 rounded-lg">
        <div className="w-32 h-32 relative">
          <Image
            src={song.img_url || "/placeholder.svg"}
            alt={`${song.song} by ${song.artist}`}
            fill={true}
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold">{song.song}</h4>
          <p className="text-gray-600">{song.artist}</p>
        </div>
      </div>
    </div>
  )
} 