import fetch from "node-fetch"
import { JSDOM } from "jsdom"
import { HttpsProxyAgent } from "https-proxy-agent"
import { SocksProxyAgent } from "socks-proxy-agent"
import { proxyManager } from "./proxy-manager"

// Type definitions for API responses
interface YouTubeOEmbedResponse {
  title: string
  thumbnail_url?: string
  author_name: string
}

interface YouTubeAPIResponse {
  items?: Array<{
    contentDetails?: { duration?: string }
    statistics?: { viewCount?: string }
    snippet?: { description?: string }
  }>
}

interface FacebookGraphResponse {
  title?: string
  source?: string
  from?: { name?: string }
  length?: number
}

interface InstagramGraphResponse {
  caption?: string
  media_type?: string
  media_url?: string
  thumbnail_url?: string
  username?: string
}

interface TwitterAPIResponse {
  data: {
    text?: string
  }
  includes?: {
    users?: Array<{ username?: string; name?: string }>
    media?: Array<{
      preview_image_url?: string
      url?: string
      duration_ms?: number
      type?: string
    }>
  }
}

interface JsonLdData {
  author?: { name?: string }
  duration?: string
  thumbnailUrl?: string
  uploadDate?: string
}

interface VideoPreviewData {
  title: string
  thumbnail: string | null
  uploader: string
  duration: number
  view_count: number
}

// Cache for preview data
const previewCache = new Map<string, { data: VideoPreviewData; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour

/**
 * Direct preview fetcher for various platforms
 * This bypasses yt-dlp for faster initial previews
 */
export async function fetchDirectPreview(
  url: string,
  platform: string,
  videoId: string,
): Promise<VideoPreviewData | null> {
  // Check cache first
  const cacheKey = `${platform}:${url}`
  const cachedData = previewCache.get(cacheKey)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached preview for ${platform}: ${url}`)
    return cachedData.data
  }

  console.log(`Fetching direct preview for ${platform}: ${url}`)

  try {
    let previewData: VideoPreviewData | null = null

    switch (platform) {
      case "youtube":
        previewData = await fetchYouTubePreview(videoId)
        break
      case "facebook":
        previewData = await fetchFacebookPreview(url, videoId)
        break
      case "instagram":
        previewData = await fetchInstagramPreview(url, videoId)
        break
      case "tiktok":
        previewData = await fetchTikTokPreview(url, videoId)
        break
      case "snapchat":
        previewData = await fetchSnapchatPreview(url, videoId)
        break
      case "twitter":
        previewData = await fetchTwitterPreview(url, videoId)
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }

    // Cache the result
    if (previewData) {
      previewCache.set(cacheKey, { data: previewData, timestamp: Date.now() })
    }

    return previewData
  } catch (error) {
    console.error(`Error fetching direct preview for ${platform}:`, error)
    return null
  }
}

/**
 * Fetch YouTube preview using oEmbed API
 */
async function fetchYouTubePreview(videoId: string): Promise<VideoPreviewData> {
  try {
    // Use YouTube oEmbed API for fast metadata
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    )

    if (!response.ok) {
      throw new Error(`YouTube oEmbed API error: ${response.status}`)
    }

    const data = (await response.json()) as YouTubeOEmbedResponse

    // Get additional data from YouTube API
    let additionalData = {
      duration: 0,
      view_count: 0,
      description: "",
    }

    if (process.env.YOUTUBE_API_KEY) {
      try {
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${process.env.YOUTUBE_API_KEY}`,
        )

        if (videoResponse.ok) {
          const videoData = (await videoResponse.json()) as YouTubeAPIResponse
          if (videoData.items && videoData.items.length > 0) {
            const item = videoData.items[0]

            // Parse duration from ISO 8601 format (PT1H2M3S)
            let duration = 0
            const durationStr = item.contentDetails?.duration
            if (durationStr) {
              const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
              if (match) {
                const hours = Number.parseInt(match[1] || "0")
                const minutes = Number.parseInt(match[2] || "0")
                const seconds = Number.parseInt(match[3] || "0")
                duration = hours * 3600 + minutes * 60 + seconds
              }
            }

            additionalData = {
              duration: duration,
              view_count: Number.parseInt(item.statistics?.viewCount || "0"),
              description: item.snippet?.description || "",
            }
          }
        }
      } catch (error) {
        console.error("YouTube API error:", error)
      }
    }

    // Fallback to thumbnail from video ID if not provided
    const thumbnail = data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

    return {
      title: data.title,
      thumbnail: thumbnail,
      uploader: data.author_name,
      duration: additionalData.duration,
      view_count: additionalData.view_count,
    }
  } catch (error) {
    console.error("Error fetching YouTube preview:", error)

    // Fallback with basic info
    return {
      title: `YouTube Video (ID: ${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      uploader: "YouTube Creator",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Fetch Facebook preview using Graph API and scraping
 */
async function fetchFacebookPreview(url: string, videoId: string): Promise<VideoPreviewData> {
  try {
    // Try Facebook Graph API first (requires access token)
    if (process.env.FACEBOOK_ACCESS_TOKEN) {
      try {
        const graphResponse = await fetch(
          `https://graph.facebook.com/v18.0/${videoId}?fields=title,description,length,source,from&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
        )

        if (graphResponse.ok) {
          const graphData = (await graphResponse.json()) as FacebookGraphResponse
          return {
            title: graphData.title || `Facebook Video (ID: ${videoId})`,
            thumbnail: graphData.source ? `https://graph.facebook.com/${videoId}/picture` : null,
            uploader: graphData.from?.name || "Facebook User",
            duration: graphData.length || 0,
            view_count: 0, // Graph API doesn't provide view count
          }
        }
      } catch (error) {
        console.error("Facebook Graph API error:", error)
      }
    }

    // Fallback to scraping
    const html = await fetchWithProxy(url)
    if (!html) throw new Error("Failed to fetch Facebook page")

    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata from Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Extract video title from various elements
    let title = ogTitle || document.title
    if (!title || title.includes("Facebook")) {
      // Try to find a more specific title
      const possibleTitleElements = [
        ...Array.from(document.querySelectorAll("h1")),
        ...Array.from(document.querySelectorAll('[data-testid="post-message"]')),
        ...Array.from(document.querySelectorAll(".userContent")),
      ]

      for (const element of possibleTitleElements) {
        if (element.textContent && element.textContent.trim().length > 0) {
          title = element.textContent.trim()
          break
        }
      }
    }

    // Extract uploader
    let uploader = document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") || "Facebook User"
    const authorElement =
      document.querySelector('[data-testid="story-subtitle"] a') ||
      document.querySelector(".profileLink") ||
      document.querySelector(".fwb a")

    if (authorElement && authorElement.textContent) {
      uploader = authorElement.textContent.trim()
    }

    return {
      title: title || `Facebook Video (ID: ${videoId})`,
      thumbnail: ogImage || null,
      uploader: uploader,
      duration: 0, // Hard to extract reliably from HTML
      view_count: 0, // Hard to extract reliably from HTML
    }
  } catch (error) {
    console.error("Error fetching Facebook preview:", error)

    // Basic fallback
    return {
      title: `Facebook Video (ID: ${videoId})`,
      thumbnail: null,
      uploader: "Facebook User",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Fetch Instagram preview
 */
async function fetchInstagramPreview(url: string, videoId: string): Promise<VideoPreviewData> {
  try {
    // Try Instagram Graph API first (requires access token)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      try {
        const graphResponse = await fetch(
          `https://graph.instagram.com/v18.0/${videoId}?fields=caption,media_type,media_url,thumbnail_url,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
        )

        if (graphResponse.ok) {
          const graphData = (await graphResponse.json()) as InstagramGraphResponse
          return {
            title:
              graphData.caption || `Instagram ${graphData.media_type === "VIDEO" ? "Video" : "Reel"} (ID: ${videoId})`,
            thumbnail: graphData.thumbnail_url || graphData.media_url || null,
            uploader: graphData.username ? `@${graphData.username}` : "Instagram User",
            duration: 0, // Not provided by basic API
            view_count: 0, // Not provided by basic API
          }
        }
      } catch (error) {
        console.error("Instagram Graph API error:", error)
      }
    }

    // Fallback to scraping
    const html = await fetchWithProxy(url)
    if (!html) throw new Error("Failed to fetch Instagram page")

    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata from Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Try to extract username
    let username = "Instagram User"
    const usernameMatch = url.match(/instagram\.com\/([^/]+)/) || ogTitle?.match(/@([^•]+)/)
    if (usernameMatch && usernameMatch[1] && !["p", "reel", "tv"].includes(usernameMatch[1])) {
      username = `@${usernameMatch[1]}`
    }

    // Try to extract from JSON-LD
    let jsonLdData: JsonLdData | null = null
    const scriptElements = document.querySelectorAll('script[type="application/ld+json"]')
    for (const script of Array.from(scriptElements)) {
      try {
        const scriptElement = script as HTMLScriptElement
        const data = JSON.parse(scriptElement.textContent || "{}") as JsonLdData
        if (data && (data.author || data.uploadDate || data.thumbnailUrl)) {
          jsonLdData = data
          break
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Determine if it's a reel or post
    const isReel = url.includes("/reel/")

    return {
      title:
        ogDescription || ogTitle || (isReel ? `Instagram Reel (ID: ${videoId})` : `Instagram Post (ID: ${videoId})`),
      thumbnail: ogImage || jsonLdData?.thumbnailUrl || null,
      uploader: jsonLdData?.author?.name || username,
      duration: 0, // Hard to extract reliably
      view_count: 0, // Not publicly available
    }
  } catch (error) {
    console.error("Error fetching Instagram preview:", error)

    // Basic fallback
    const isReel = url.includes("/reel/")
    return {
      title: isReel ? `Instagram Reel (ID: ${videoId})` : `Instagram Post (ID: ${videoId})`,
      thumbnail: null,
      uploader: "Instagram User",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Fetch TikTok preview
 */
async function fetchTikTokPreview(url: string, videoId: string): Promise<VideoPreviewData> {
  try {
    // TikTok doesn't have a public API, so we need to scrape
    const html = await fetchWithProxy(url)
    if (!html) throw new Error("Failed to fetch TikTok page")

    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata from Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")
    const ogVideo = document.querySelector('meta[property="og:video"]')?.getAttribute("content")

    // Try to extract username
    let username = "TikTok User"
    const usernameMatch = url.match(/tiktok\.com\/@([^/]+)/) || ogTitle?.match(/@([^\s]+)/)
    if (usernameMatch && usernameMatch[1]) {
      username = `@${usernameMatch[1]}`
    }

    // Try to extract from JSON-LD
    let jsonLdData: JsonLdData | null = null
    const scriptElements = document.querySelectorAll('script[type="application/ld+json"]')
    for (const script of Array.from(scriptElements)) {
      try {
        const scriptElement = script as HTMLScriptElement
        const data = JSON.parse(scriptElement.textContent || "{}") as JsonLdData
        if (data && (data.author || data.duration || data.thumbnailUrl)) {
          jsonLdData = data
          break
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Try to extract duration
    let duration = 0
    if (jsonLdData?.duration) {
      // Parse ISO 8601 duration format (PT1M30S)
      const match = jsonLdData.duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
      if (match) {
        const minutes = Number.parseInt(match[1] || "0")
        const seconds = Number.parseInt(match[2] || "0")
        duration = minutes * 60 + seconds
      }
    }

    return {
      title: ogDescription || ogTitle || `TikTok Video (ID: ${videoId})`,
      thumbnail: ogImage || jsonLdData?.thumbnailUrl || null,
      uploader: jsonLdData?.author?.name || username,
      duration: duration,
      view_count: 0, // Not reliably available
    }
  } catch (error) {
    console.error("Error fetching TikTok preview:", error)

    // Basic fallback
    return {
      title: `TikTok Video (ID: ${videoId})`,
      thumbnail: null,
      uploader: "TikTok User",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Fetch Snapchat preview
 */
async function fetchSnapchatPreview(url: string, videoId: string): Promise<VideoPreviewData> {
  try {
    // Snapchat doesn't have a public API, so we need to scrape
    const html = await fetchWithProxy(url)
    if (!html) throw new Error("Failed to fetch Snapchat page")

    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata from Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Try to extract username
    let username = "Snapchat User"
    const usernameElement = document.querySelector('[data-testid="username"]') || document.querySelector(".username")

    if (usernameElement && usernameElement.textContent) {
      username = usernameElement.textContent.trim()
    } else {
      // Try to extract from URL or title
      const usernameMatch = url.match(/snapchat\.com\/(?:add|discover)\/([^/]+)/) || ogTitle?.match(/(@[^\s]+)/)
      if (usernameMatch && usernameMatch[1]) {
        username = usernameMatch[1]
      }
    }

    // Try to extract title
    let title = ogTitle || ogDescription || `Snapchat Story (ID: ${videoId})`

    // If title is just "Snapchat", try to find a better one
    if (!title || title === "Snapchat") {
      const titleElement = document.querySelector('[data-testid="title"]') || document.querySelector(".title")

      if (titleElement && titleElement.textContent) {
        title = titleElement.textContent.trim()
      }
    }

    return {
      title: title,
      thumbnail: ogImage || null,
      uploader: username,
      duration: 0, // Not available
      view_count: 0, // Not available
    }
  } catch (error) {
    console.error("Error fetching Snapchat preview:", error)

    // Basic fallback
    return {
      title: `Snapchat Story (ID: ${videoId})`,
      thumbnail: null,
      uploader: "Snapchat User",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Fetch Twitter preview
 */
async function fetchTwitterPreview(url: string, videoId: string): Promise<VideoPreviewData> {
  try {
    // Try Twitter API first (requires bearer token)
    if (process.env.TWITTER_BEARER_TOKEN) {
      try {
        // Extract tweet ID from URL
        const tweetIdMatch =
          url.match(/twitter\.com\/[^/]+\/status\/(\d+)/) || url.match(/x\.com\/[^/]+\/status\/(\d+)/)

        if (tweetIdMatch && tweetIdMatch[1]) {
          const tweetId = tweetIdMatch[1]

          const apiResponse = await fetch(
            `https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id,attachments.media_keys&media.fields=duration_ms,preview_image_url,type,url&user.fields=name,username`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
              },
            },
          )

          if (apiResponse.ok) {
            const apiData = (await apiResponse.json()) as TwitterAPIResponse
            const tweet = apiData.data
            const user = apiData.includes?.users?.[0]
            const media = apiData.includes?.media?.[0]

            return {
              title: tweet.text || `Twitter Video`,
              thumbnail: media?.preview_image_url || media?.url || null,
              uploader: user ? `@${user.username}` : "Twitter User",
              duration: media?.duration_ms ? Math.floor(media.duration_ms / 1000) : 0,
              view_count: 0, // Not provided by API
            }
          }
        }
      } catch (error) {
        console.error("Twitter API error:", error)
      }
    }

    // Fallback to scraping
    const html = await fetchWithProxy(url)
    if (!html) throw new Error("Failed to fetch Twitter page")

    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata from Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Try to extract username
    let username = "Twitter User"
    const usernameMatch =
      url.match(/twitter\.com\/([^/]+)/) || url.match(/x\.com\/([^/]+)/) || ogTitle?.match(/@([^)]+)/)

    if (usernameMatch && usernameMatch[1] && !["status", "i"].includes(usernameMatch[1])) {
      username = `@${usernameMatch[1]}`
    }

    return {
      title: ogDescription || ogTitle || `Twitter Video`,
      thumbnail: ogImage || null,
      uploader: username,
      duration: 0, // Hard to extract reliably
      view_count: 0, // Not publicly available
    }
  } catch (error) {
    console.error("Error fetching Twitter preview:", error)

    // Basic fallback
    return {
      title: `Twitter Video`,
      thumbnail: null,
      uploader: "Twitter User",
      duration: 0,
      view_count: 0,
    }
  }
}

/**
 * Helper function to fetch with proxy support
 */
async function fetchWithProxy(url: string): Promise<string | null> {
  // Generate a random user agent
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  ]
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  // Try to use a proxy if available
  const proxyUrl = proxyManager.getCurrentProxy()
  let agent: HttpsProxyAgent<string> | SocksProxyAgent<string> | undefined

  if (proxyUrl) {
    if (proxyUrl.startsWith("socks")) {
      agent = new SocksProxyAgent(proxyUrl)
    } else {
      agent = new HttpsProxyAgent(proxyUrl)
    }
  }

  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": randomUserAgent,
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Referer: "https://www.google.com/",
      },
      // @ts-ignore - Type issues with node-fetch and proxy agents
      agent,
      timeout: 10000,
    })

    if (!response.ok) {
      console.error(`Failed to fetch HTML: ${response.status} ${response.statusText}`)
      return null
    }

    return await response.text()
  } catch (error) {
    console.error("Error fetching with proxy:", error)
    return null
  }
}
