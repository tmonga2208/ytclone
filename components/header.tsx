"use client"

import type React from "react"

import { Search, Menu, Mic, VideoIcon, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchSearchSuggestions } from "@/lib/api"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const results = await fetchSearchSuggestions(searchQuery)
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }, [])

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions, debounce])

  useEffect(() => {
    debouncedFetchSuggestions(query)
  }, [query, debouncedFetchSuggestions])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`)
      setShowSuggestions(false)
    }
  }

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
          handleSearch(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => router.push("/")}>
          <VideoIcon className="h-8 w-8 text-red-600" />
          <span className="text-xl font-semibold">YouTube</span>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-2xl mx-4 relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="flex items-center border border-gray-300 rounded-l-full bg-white focus-within:border-blue-500">
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search"
                className="flex-1 border-0 rounded-l-full px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSearch()}
            className="bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-6"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="ml-2 rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-12 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 py-2 z-50 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSearch(suggestion)}
                className={cn(
                  "flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100",
                  selectedIndex === index && "bg-gray-100",
                )}
              >
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <VideoIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}
