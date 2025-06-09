"use client"

import type React from "react"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  title: string
  description?: string
}

export default function YouTubeSearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce function to limit API calls
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  // Fetch search suggestions with race condition protection
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    let ignore = false

    try {
      const response = await fetch(
        `https://invidious-1cf4.onrender.com/api/v1/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }

      const data = await response.json()

      if (!ignore) {
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : data)
        setShowSuggestions(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      if (!ignore) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    } finally {
      if (!ignore) {
        setIsLoading(false)
      }
    }

    return () => {
      ignore = true
    }
  }, [])

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions, debounce])

  useEffect(() => {
    debouncedFetchSuggestions(query)
  }, [query, debouncedFetchSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          setQuery(suggestions[selectedIndex])
          setShowSuggestions(false)
        }
        handleSearch()
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      console.log("Searching for:", query)
      setShowSuggestions(false)
      // Here you would typically navigate to search results or trigger search
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    console.log("Selected suggestion:", suggestion)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 150)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <div className="flex items-center border border-gray-300 rounded-l-full bg-white focus-within:border-blue-500 focus-within:shadow-md transition-all duration-200">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search"
              className="flex-1 border-0 rounded-l-full px-4 py-2 text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="mr-2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Button */}
        <Button
          type="button"
          onClick={handleSearch}
          className="bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-6 py-2 h-10"
          disabled={isLoading}
        >
          <Search className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-12 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 py-2 z-50 max-h-96 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                selectedIndex === index && "bg-gray-100",
              )}
            >
              <Search className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-800 truncate">{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-12 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 py-4 z-50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading suggestions...</span>
          </div>
        </div>
      )}
    </div>
  )
}
