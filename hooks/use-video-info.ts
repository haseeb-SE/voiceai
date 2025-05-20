"use client"

import { useState, useRef, useCallback } from "react"
import type { VideoInfoType } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export function useVideoInfo() {
  const [videoInfo, setVideoInfo] = useState<VideoInfoType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastUrlRef = useRef<string | null>(null)
  const retryCountRef = useRef<number>(0)

  const fetchVideoInfo = useCallback(
    async (url: string, forceRefresh = false) => {
      // Clear any previous fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      // Track if this is a refresh of the same URL
      const isRefresh = url === lastUrlRef.current && forceRefresh

      if (isRefresh) {
        setIsRefreshing(true)
        retryCountRef.current++
      } else {
        setIsLoading(true)
        retryCountRef.current = 0
        lastUrlRef.current = url
      }

      setError(null)

      try {
        // Set a timeout to show a toast if the request takes too long
        timeoutRef.current = setTimeout(() => {
          toast({
            title: "Taking longer than expected",
            description: "We're still working on getting your video information...",
            duration: 5000,
          })
        }, 5000)

        // Add cache-busting parameter for refreshes
        const requestUrl = forceRefresh ? `/api/video/info?_=${Date.now()}` : "/api/video/info"

        const response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": forceRefresh ? "no-cache" : "default",
            Pragma: forceRefresh ? "no-cache" : "default",
          },
          body: JSON.stringify({
            url,
            refresh: forceRefresh,
            retryCount: retryCountRef.current,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch video info")
        }

        const data = await response.json()

        // Only update if we have better data than before
        if (!videoInfo || isRefresh || hasMoreInfo(data, videoInfo)) {
          setVideoInfo(data)
        }

        return data
      } catch (err) {
        // Don't set error if it was aborted
        if (err instanceof DOMException && err.name === "AbortError") {
          return null
        }

        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)

        // Only show toast for non-refreshes to avoid spamming
        if (!isRefresh) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        throw err
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        if (isRefresh) {
          setIsRefreshing(false)
        } else {
          setIsLoading(false)
        }
      }
    },
    [toast, videoInfo],
  )

  // Function to refresh the current video info
  const refreshVideoInfo = useCallback(async () => {
    if (!lastUrlRef.current) return null

    try {
      return await fetchVideoInfo(lastUrlRef.current, true)
    } catch (err) {
      console.error("Error refreshing video info:", err)
      return null
    }
  }, [fetchVideoInfo])

  // Helper to determine if new data has more info than existing data
  function hasMoreInfo(newData: VideoInfoType, oldData: VideoInfoType): boolean {
    let score = 0

    // Check if new data has fields that old data doesn't
    if (newData.thumbnail && !oldData.thumbnail) score += 2
    if (newData.duration && !oldData.duration) score += 2
    if (newData.uploader && !oldData.uploader) score += 1
    if (newData.view_count && !oldData.view_count) score += 1

    // Check if new data has a better title (longer or more descriptive)
    if (newData.title && (!oldData.title || newData.title.length > oldData.title.length)) {
      // If old title is just a generic "Platform Video (ID: xxx)" and new one isn't
      if (oldData.title?.includes("(ID:") && !newData.title.includes("(ID:")) {
        score += 3
      } else {
        score += 1
      }
    }

    return score > 0
  }

  return {
    videoInfo,
    isLoading,
    isRefreshing,
    error,
    fetchVideoInfo,
    refreshVideoInfo,
  }
}
