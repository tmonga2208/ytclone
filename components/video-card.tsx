"use client"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Video, SearchResult } from "@/types/video"

interface VideoCardProps {
  video: Video | SearchResult
  layout?: "grid" | "list"
}

export default function VideoCard({ video, layout = "grid" }: VideoCardProps) {
  const router = useRouter()

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  const getThumbnail = () => {
    if ("videoThumbnails" in video && video.videoThumbnails) {
      const thumbnail = video.videoThumbnails.find((t) => t.quality === "medium") || video.videoThumbnails[0]
      return thumbnail?.url || "/placeholder.svg?height=180&width=320"
    }
    return "/placeholder.svg?height=180&width=320"
  }

  const getVideoId = () => {
    return "videoId" in video ? video.videoId : ""
  }

  const handleVideoClick = () => {
    const videoId = getVideoId()
    if (videoId) {
      router.push(`/watch?v=${videoId}`)
    } else {
      // Fallback: use a sample video ID for testing
      console.warn("No video ID available, using sample ID")
      router.push(`/watch?v=dQw4w9WgXcQ`) // Sample YouTube video ID
    }
  }

  if (layout === "list") {
    return (
      <div className="flex space-x-4 p-2 hover:bg-gray-50 cursor-pointer" onClick={handleVideoClick}>
        <div className="relative flex-shrink-0">
          <img
            src={getThumbnail() || "/placeholder.svg"}
            alt={video.title}
            className="w-40 h-24 object-cover rounded"
          />
          {"lengthSeconds" in video && video.lengthSeconds && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
              {formatDuration(video.lengthSeconds)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
          <p className="text-xs text-gray-600 mb-1">{video.author}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            {"viewCount" in video && video.viewCount && <span>{formatViews(video.viewCount)}</span>}
            {"publishedText" in video && video.publishedText && (
              <>
                <span>•</span>
                <span>{video.publishedText}</span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="cursor-pointer group" onClick={handleVideoClick}>
      <div className="relative mb-3">
        <img
          src={getThumbnail() || "/placeholder.svg"}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
        {"lengthSeconds" in video && video.lengthSeconds && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.lengthSeconds)}
          </span>
        )}
      </div>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{video.author?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600">{video.title}</h3>
          <p className="text-xs text-gray-600 mb-1">{video.author}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            {"viewCount" in video && video.viewCount && <span>{formatViews(video.viewCount)}</span>}
            {"publishedText" in video && video.publishedText && (
              <>
                <span>•</span>
                <span>{video.publishedText}</span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
