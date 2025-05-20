"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { VideoInfo } from "@/components/video-info"
import { DownloadOptions } from "@/components/download-options"
import { ProgressModal } from "@/components/progress-modal"
import { useToast } from "@/components/ui/use-toast"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { useVideoInfo } from "@/hooks/use-video-info"
import { useDownloadManager } from "@/hooks/use-download-manager"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { detectPlatform, getPlatformBorderColor, getPlatformButtonColor } from "@/lib/platform-detector"

export function YoutubeDownloader() {
  const [url, setUrl] = useState("")
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [showError, setShowError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [platform, setPlatform] = useState<string | null>(null)
  const { toast } = useToast()
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    videoInfo,
    isLoading: isLoadingInfo,
    isRefreshing,
    error: videoInfoError,
    fetchVideoInfo,
    refreshVideoInfo,
  } = useVideoInfo()

  const {
    activeDownload,
    startDownload,
    cancelDownload,
    downloadProgress,
    estimatedTime,
    fileSize,
    downloadUrl,
    format,
    videoTitle,
    handleDownloadNow,
    isAudioOnly,
    downloadStatus,
    modalVisible,
    closeModal,
  } = useDownloadManager()

  // Validate URL as user types
  useEffect(() => {
    const detectedPlatform = detectPlatform(url)
    setPlatform(detectedPlatform)
    setIsValidUrl(!!detectedPlatform)

    // Reset error state when URL changes
    if (showError) {
      setShowError(false)
    }
  }, [url, showError])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current)
      }
    }
  }, [])

  // Auto-refresh incomplete video info after a delay
  useEffect(() => {
    if (videoInfo && (!videoInfo.thumbnail || !videoInfo.duration || !videoInfo.view_count)) {
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current)
      }

      // Set a timeout to auto-refresh after 3 seconds
      autoRefreshTimeoutRef.current = setTimeout(() => {
        refreshVideoInfo()
          .then(() => {
            console.log("Auto-refreshed video info")
          })
          .catch((err) => {
            console.error("Error auto-refreshing video info:", err)
          })
      }, 3000)
    }

    return () => {
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current)
      }
    }
  }, [videoInfo, refreshVideoInfo])

  const handleFetchInfo = async () => {
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: `Please enter a valid ${platform || "video"} URL`,
        variant: "destructive",
      })
      return
    }

    setShowError(false)
    setRetryCount(0)

    try {
      // Set a timeout to show a loading toast if it takes too long
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }

      fetchTimeoutRef.current = setTimeout(() => {
        toast({
          title: "Still working...",
          description: "This might take a moment. We're fetching your video information.",
          duration: 5000,
        })
      }, 3000)

      await fetchVideoInfo(url)

      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
        fetchTimeoutRef.current = null
      }
    } catch (error) {
      console.error("Error fetching video info:", error)
      setShowError(true)

      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
        fetchTimeoutRef.current = null
      }

      toast({
        title: "Error",
        description: "Failed to fetch video information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRetry = async () => {
    if (!isValidUrl) return

    setRetryCount((prev) => prev + 1)
    setShowError(false)

    try {
      toast({
        title: "Retrying",
        description: "Attempting to fetch video information again...",
      })

      await fetchVideoInfo(url, true)
    } catch (error) {
      console.error("Error retrying fetch:", error)
      setShowError(true)

      toast({
        title: "Error",
        description: "Still unable to fetch video information. Please try a different video.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (format: string) => {
    if (!videoInfo) {
      toast({
        title: "Error",
        description: "Please fetch video information first",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Starting download with format:", format)
      await startDownload(url, format, videoInfo.title || "")
    } catch (error) {
      console.error("Error starting download:", error)
      toast({
        title: "Error",
        description: "Failed to start download. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Enter a URL from YouTube, Facebook, Instagram, TikTok, or Snapchat"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`pr-10 bg-gray-900 border-gray-700 text-white ${isValidUrl ? getPlatformBorderColor(platform) : ""}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isValidUrl && (
              <div
                className={`h-2 w-2 rounded-full ${
                  platform === "youtube"
                    ? "bg-red-500"
                    : platform === "facebook"
                      ? "bg-blue-500"
                      : platform === "instagram"
                        ? "bg-pink-500"
                        : platform === "tiktok"
                          ? "bg-teal-500"
                          : platform === "snapchat"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                }`}
              />
            )}
          </div>
        </div>
        <Button
          onClick={handleFetchInfo}
          disabled={isLoadingInfo || !isValidUrl}
          className={`w-full md:w-auto ${getPlatformButtonColor(platform)} text-white`}
        >
          {isLoadingInfo ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Get Video Info
            </>
          )}
        </Button>
      </div>

      {platform && (
        <div className="text-sm text-gray-400">
          Detected platform: <span className="font-medium capitalize">{platform}</span>
        </div>
      )}

      {showError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Detection Error</AlertTitle>
          <AlertDescription>
            We're having trouble accessing this video. It may be private or restricted.
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs">Some videos may be restricted or require authentication.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={retryCount >= 3 || isLoadingInfo}
                className="border-red-800 text-white hover:bg-red-800/20"
              >
                {isLoadingInfo ? <Loader2 className="h-3 w-3 animate-spin" /> : "Try Again"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {videoInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VideoInfo videoInfo={videoInfo} onRefresh={refreshVideoInfo} isRefreshing={isRefreshing} />

          <div className="md:col-span-2">
            <Card className="border border-gray-700 bg-gray-800 text-white shadow-lg">
              <CardContent className="pt-6">
                <Tabs defaultValue="video">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-700">
                    <TabsTrigger
                      value="audio"
                      className={`data-[state=active]:${getPlatformButtonColor(platform)} data-[state=active]:text-white`}
                    >
                      Audio (MP3)
                    </TabsTrigger>
                    <TabsTrigger
                      value="video"
                      className={`data-[state=active]:${getPlatformButtonColor(platform)} data-[state=active]:text-white`}
                    >
                      Video (MP4)
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="audio" className="mt-4">
                    <DownloadOptions type="audio" onDownload={handleDownload} platform={platform} />
                  </TabsContent>
                  <TabsContent value="video" className="mt-4">
                    <DownloadOptions type="video" onDownload={handleDownload} platform={platform} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      <ProgressModal
        isOpen={modalVisible}
        title={videoTitle || videoInfo?.title || "Downloading..."}
        progress={downloadProgress}
        eta={estimatedTime}
        fileSize={fileSize}
        format={format}
        taskId={activeDownload !== "initializing" ? activeDownload : null}
        onCancel={cancelDownload}
        onDownload={handleDownloadNow}
        status={downloadStatus}
        isAudioOnly={isAudioOnly}
        platform={platform}
      />
    </div>
  )
}
