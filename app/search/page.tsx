"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import VideoCard from "@/components/video-card"
import { searchVideos } from "@/lib/api"
import type { SearchResult } from "@/types/video"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return

      setLoading(true)
      try {
        const searchResults = await searchVideos(query)
        setResults(searchResults.filter((result) => result.type === "video"))
      } catch (error) {
        console.error("Error searching videos:", error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex space-x-4 animate-pulse">
              <div className="w-40 h-24 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-medium mb-4">Search results for "{query}"</h1>
      <div className="space-y-4">
        {results.map((result, index) => (
          <VideoCard key={`${result.videoId}-${index}`} video={result} layout="list" />
        ))}
      </div>
      {results.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
