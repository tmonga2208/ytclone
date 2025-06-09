const API_BASE = "https://invidious-1cf4.onrender.com/api/v1"

type Video = {}

type SearchResult = {}

export async function fetchPopularVideos(): Promise<Video[]> {
  try {
    console.log("Fetching popular videos...")
    const response = await fetch(`${API_BASE}/popular`)

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      throw new Error(`Failed to fetch popular videos: ${response.status}`)
    }

    const data = await response.json()
    console.log("Popular videos received:", data?.length || 0, "videos")
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching popular videos:", error)
    return []
  }
}

export async function searchVideos(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search videos")
    return await response.json()
  } catch (error) {
    console.error("Error searching videos:", error)
    return []
  }
}

export async function fetchVideo(videoId: string): Promise<Video | null> {
  if (!videoId) {
    console.error("No video ID provided")
    return null
  }

  try {
    console.log(`Fetching video: ${videoId}`)
    const response = await fetch(`${API_BASE}/videos/${videoId}`)

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Video data received:", data)
    return data
  } catch (error) {
    console.error("Error fetching video:", error)
    return null
  }
}

export async function fetchSearchSuggestions(query: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to fetch suggestions")
    const data = await response.json()
    return Array.isArray(data.suggestions) ? data.suggestions : data
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return []
  }
}
