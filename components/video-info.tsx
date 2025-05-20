"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { formatDuration } from "@/lib/utils"
import type { VideoInfoType } from "@/types"
import { Clock, User, Eye, Video, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { generatePlatformIconDataUrl } from "@/lib/platform-specific-thumbnails"

interface VideoInfoProps {
  videoInfo: VideoInfoType
  onRefresh?: () => void
  isRefreshing?: boolean
  platform?: string | null
}

export function VideoInfo({ videoInfo, onRefresh, isRefreshing = false, platform }: VideoInfoProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const detectedPlatform = platform || getPlatformFromTitle(videoInfo.title)
  const [platformIconUrl, setPlatformIconUrl] = useState<string | null>(null)

  // Reset states when videoInfo changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
    setRetryCount(0)
  }, [videoInfo.thumbnail])

  // Generate platform icon data URL
  useEffect(() => {
    if (detectedPlatform) {
      const iconUrl = generatePlatformIconDataUrl(detectedPlatform)
      setPlatformIconUrl(iconUrl)
    }
  }, [detectedPlatform])

  // Retry loading image if it fails
  const handleImageError = () => {
    if (retryCount < 2 && videoInfo.thumbnail) {
      // Try up to 2 times with a delay
      setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        setImageError(false)
      }, 1000)
    } else {
      setImageError(true)
    }
  }

  return (
    <Card className="overflow-hidden border border-gray-700 bg-gray-800 text-white shadow-lg relative">
      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="absolute top-2 right-2 z-10 bg-gray-800/80 p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          title="Refresh video info"
        >
          <RefreshCw className={`h-4 w-4 text-gray-300 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      )}

      <div className="relative aspect-video w-full">
        {videoInfo.thumbnail && !imageError ? (
          <>
            {/* Show skeleton loader while image is loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                {platformIconUrl ? (
                  <div
                    className="h-12 w-12 opacity-50"
                    style={{
                      backgroundImage: `url(${platformIconUrl})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ) : (
                  <PlatformIcon platform={detectedPlatform} className="h-12 w-12 text-gray-500" />
                )}
              </div>
            )}
            <Image
              src={videoInfo.thumbnail || "/placeholder.svg"}
              alt={videoInfo.title || "Video thumbnail"}
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              priority
              unoptimized // Add this to avoid optimization issues with external URLs
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              {platformIconUrl ? (
                <div
                  className="h-16 w-16 mb-2"
                  style={{
                    backgroundImage: `url(${platformIconUrl})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              ) : (
                <PlatformIcon platform={detectedPlatform} className="h-16 w-16 mb-2" />
              )}
              <span className="text-sm">{detectedPlatform} Video Preview</span>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{videoInfo.title || "Unknown title"}</h3>
        <div className="text-sm text-gray-300 space-y-2">
          {videoInfo.duration ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(videoInfo.duration)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Duration unavailable</span>
            </div>
          )}

          {videoInfo.uploader ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{videoInfo.uploader}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" />
              <span>Uploader unavailable</span>
            </div>
          )}

          {videoInfo.view_count ? (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{videoInfo.view_count.toLocaleString()} views</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="h-4 w-4" />
              <span>View count unavailable</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to determine platform from title
function getPlatformFromTitle(title: string | undefined): string {
  if (!title) return "Video"

  if (title.includes("YouTube") || title.includes("youtube")) return "YouTube"
  if (title.includes("Facebook") || title.includes("facebook")) return "Facebook"
  if (title.includes("Instagram") || title.includes("instagram")) return "Instagram"
  if (title.includes("TikTok") || title.includes("tiktok")) return "TikTok"
  if (title.includes("Snapchat") || title.includes("snapchat")) return "Snapchat"
  if (title.includes("Twitter") || title.includes("twitter") || title.includes("X.com")) return "Twitter"

  return "Video"
}

// Platform-specific icon component
function PlatformIcon({ platform, className = "h-6 w-6" }: { platform: string; className?: string }) {
  switch (platform) {
    case "YouTube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case "Facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case "Instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case "TikTok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    case "Snapchat":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.359-1.275.975-3.225 1.125-.046.193-.09.404-.135.599-.046.195-.091.404-.141.619-.075.224-.239.435-.555.435h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.23-.09-.404-.135-.599-.045-.195-.09-.42-.135-.634-1.964-.149-2.999-.78-3.224-1.124-.046-.075-.075-.15-.075-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.136-.045-.27-.089-.345-.119-.824-.33-1.229-.719-1.229-1.168 0-.359.284-.689.734-.838.149-.045.33-.075.494-.075.134 0 .314.03.464.119.345.149.719.27 1.049.27.205 0 .344-.03.42-.074-.016-.165-.031-.345-.046-.54-.074-1.62-.195-3.631.33-4.814C7.88 1.07 11.237.793 12.222.793h.016z" />
        </svg>
      )
    case "Twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    default:
      return <Video className={className} />
  }
}
