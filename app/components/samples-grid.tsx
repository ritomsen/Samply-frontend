import { Sample } from "../types/music"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Image from "next/image"

interface SamplesGridProps {
  samples: Sample[]
}

export function SamplesGrid({ samples }: SamplesGridProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Samples Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samples.map((sample, index) => (
          <Card key={index} className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 relative">
                  <Image
                    src={sample.img_url || "/placeholder.svg"}
                    alt=""
                    fill={true}
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
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
  )
} 