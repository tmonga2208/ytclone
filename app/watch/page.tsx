"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoCard from "@/components/video-card"
import { fetchVideo, fetchPopularVideos } from "@/lib/api"
import type { Video } from "@/types/video"

export default function WatchPage() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v") || ""
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoId) {
        setError("No video ID provided")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("Loading video with ID:", videoId)

        // Load related videos first (they're more likely to work)
        const popularVideos = await fetchPopularVideos()
        setRelatedVideos(popularVideos.slice(0, 20))

        // Try to load the specific video
        const videoData = await fetchVideo(videoId)

        if (!videoData) {
          setError("Video not found or failed to load")
        } else {
          setVideo(videoData)
        }
      } catch (error) {
        console.error("Error loading video:", error)
        setError("Failed to load video")
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [videoId])

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600 text-lg">{error}</p>
        <p className="text-gray-600">Video ID: {videoId || "Not provided"}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <div className="flex-1">
          <div className="aspect-video bg-gray-300 rounded-lg animate-pulse mb-4"></div>
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-full lg:w-96">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="w-40 h-24 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Video not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Main video section */}
      <div className="flex-1">
        {/* Video player placeholder */}
        <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
          <p className="text-white">Video Player Placeholder</p>
          <p className="text-white text-sm mt-2">Video ID: {video.videoId}</p>
        </div>

        {/* Video info */}
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">{video.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{formatViews(video.viewCount)}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{video.publishedText}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dislike
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Channel info */}
          <div className="flex items-center space-x-4 py-4 border-t border-b">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="font-medium">{video.author.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{video.author}</h3>
            </div>
            <Button variant="outline">Subscribe</Button>
          </div>

          {/* Description */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm whitespace-pre-wrap line-clamp-3">{video.description}</p>
          </div>
        </div>
      </div>

      {/* Related videos sidebar */}
      <div className="w-full lg:w-96">
        <h2 className="font-medium mb-4">Related videos</h2>
        <div className="space-y-3">
          {relatedVideos.map((relatedVideo) => (
            <VideoCard key={relatedVideo.videoId} video={relatedVideo} layout="list" />
          ))}
        </div>
      </div>
    </div>
  )
}
