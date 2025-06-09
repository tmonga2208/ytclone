"use client"

import {
  Home,
  TrendingUp,
  Music,
  Film,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Podcast,
  History,
  Clock,
  ThumbsUp,
  PlaySquare,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const mainItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: TrendingUp, label: "Trending", path: "/trending" },
    { icon: Music, label: "Music", path: "/music" },
    { icon: Film, label: "Movies", path: "/movies" },
    { icon: Gamepad2, label: "Gaming", path: "/gaming" },
    { icon: Newspaper, label: "News", path: "/news" },
    { icon: Trophy, label: "Sports", path: "/sports" },
    { icon: Lightbulb, label: "Learning", path: "/learning" },
    { icon: Shirt, label: "Fashion", path: "/fashion" },
    { icon: Podcast, label: "Podcasts", path: "/podcasts" },
  ]

  const libraryItems = [
    { icon: History, label: "History", path: "/history" },
    { icon: Clock, label: "Watch later", path: "/watch-later" },
    { icon: ThumbsUp, label: "Liked videos", path: "/liked" },
    { icon: PlaySquare, label: "Your videos", path: "/your-videos" },
  ]

  if (!isOpen) {
    return (
      <aside className="w-20 bg-white border-r flex flex-col items-center py-4 space-y-4">
        {mainItems.slice(0, 4).map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => router.push(item.path)}
            className={cn(
              "flex flex-col items-center space-y-1 h-auto py-3 px-2",
              pathname === item.path && "bg-gray-100",
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-white border-r h-full overflow-y-auto">
      <div className="p-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={cn("w-full justify-start space-x-6 py-2 px-3", pathname === item.path && "bg-gray-100")}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        <hr className="my-3" />

        {/* Library */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-sm">Library</span>
            <ChevronRight className="h-4 w-4" />
          </div>
          {libraryItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={cn("w-full justify-start space-x-6 py-2 px-3", pathname === item.path && "bg-gray-100")}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
