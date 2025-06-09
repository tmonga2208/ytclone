export interface Video {
  videoId: string
  title: string
  author: string
  authorId: string
  authorUrl: string
  videoThumbnails: VideoThumbnail[]
  description: string
  viewCount: number
  published: number
  publishedText: string
  lengthSeconds: number
  liveNow: boolean
  premium: boolean
  isUpcoming: boolean
}

export interface VideoThumbnail {
  quality: string
  url: string
  width: number
  height: number
}

export interface Channel {
  author: string
  authorId: string
  authorUrl: string
  authorBanners: VideoThumbnail[]
  authorThumbnails: VideoThumbnail[]
  subCount: number
  totalViews: number
  joined: number
  description: string
}

export interface SearchResult {
  type: "video" | "channel" | "playlist"
  title: string
  videoId?: string
  author?: string
  authorId?: string
  authorUrl?: string
  videoThumbnails?: VideoThumbnail[]
  description?: string
  viewCount?: number
  published?: number
  publishedText?: string
  lengthSeconds?: number
}
