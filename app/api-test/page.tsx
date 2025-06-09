"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const API_BASE = "https://invidious-1cf4.onrender.com/api/v1"

export default function ApiTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testEndpoint = async (endpoint: string) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      console.log(`Testing: ${API_BASE}${endpoint}`)
      const response = await fetch(`${API_BASE}${endpoint}`)

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
      console.log("Response data:", data)
    } catch (err: any) {
      setError(err.message)
      console.error("Test error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invidious API Test</h1>

      <div className="space-y-4 mb-6">
        <Button onClick={() => testEndpoint("/popular")} disabled={loading}>
          Test Popular Videos
        </Button>
        <Button onClick={() => testEndpoint("/search?q=test")} disabled={loading}>
          Test Search
        </Button>
        <Button onClick={() => testEndpoint("/videos/dQw4w9WgXcQ")} disabled={loading}>
          Test Specific Video
        </Button>
        <Button onClick={() => testEndpoint("/search/suggestions?q=test")} disabled={loading}>
          Test Search Suggestions
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Results:</h3>
          <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
