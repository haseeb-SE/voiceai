import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import ytdl from "ytdl-core"
import { config } from "@/lib/config"
import path from "path"
import fs from "fs"
import os from "os"
import { convertJsonCookiesToNetscape } from "@/lib/cookie-converter"
import { proxyManager } from "@/lib/proxy-manager"
import { detectPlatform, extractVideoId } from "@/lib/platform-detector"

// Add these imports at the top of the file
import { JSDOM } from "jsdom"
import { HttpsProxyAgent } from "https-proxy-agent"
import { SocksProxyAgent } from "socks-proxy-agent"
import fetch from "node-fetch"

export const runtime = "nodejs"
export const maxDuration = 60 // Increased from 30 to 60 seconds

// Cache for video info to avoid repeated requests
const videoInfoCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour in milliseconds

// Create a cookies file from the environment variable
async function createCookiesFile(): Promise<string> {
  try {
    // Create a temporary directory for cookies if it doesn't exist
    const cookiesDir = path.join(os.tmpdir(), "video-downloader", "cookies")
    if (!fs.existsSync(cookiesDir)) {
      fs.mkdirSync(cookiesDir, { recursive: true })
    }

    // Create a temporary cookies file
    const cookiesPath = path.join(cookiesDir, "cookies.txt")

    // Check if we have cookies in the environment variable
    const cookiesContent = process.env.COOKIES || ""

    if (cookiesContent) {
      // Check if the cookies are in JSON format and convert if needed
      if (cookiesContent.trim().startsWith("[") || cookiesContent.trim().startsWith("{")) {
        console.log("Detected JSON format cookies, converting to Netscape format")
        const netscapeCookies = convertJsonCookiesToNetscape(cookiesContent)
        fs.writeFileSync(cookiesPath, netscapeCookies)
        console.log("Created cookies file from environment variable (converted from JSON)")
      } else {
        // Assume it's already in Netscape format
        fs.writeFileSync(cookiesPath, cookiesContent)
        console.log("Created cookies file from environment variable (Netscape format)")
      }
    } else {
      // Create a minimal cookies file with default values
      const minimalCookies = `# Netscape HTTP Cookie File
.youtube.com	TRUE	/	FALSE	1735689600	CONSENT	YES+cb
.youtube.com	TRUE	/	FALSE	1735689600	VISITOR_INFO1_LIVE	random_alphanumeric_string
.youtube.com	TRUE	/	FALSE	1735689600	YSC	random_alphanumeric_string
.youtube.com	TRUE	/	FALSE	1735689600	GPS	1
.facebook.com	TRUE	/	FALSE	1735689600	c_user	random_value
.facebook.com	TRUE	/	FALSE	1735689600	xs	random_value
.instagram.com	TRUE	/	FALSE	1735689600	sessionid	random_value
.tiktok.com	TRUE	/	FALSE	1735689600	tt_webid	random_value
`
      fs.writeFileSync(cookiesPath, minimalCookies)
      console.log("Created minimal cookies file")
    }

    return cookiesPath
  } catch (error) {
    console.error("Error creating cookies file:", error)
    throw error
  }
}

// Function to get video info with a timeout
async function getInfoWithTimeout(fn: () => Promise<any>, timeoutMs: number): Promise<any> {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)),
  ])
}

// Get platform-specific fallback info immediately without waiting for yt-dlp
async function getPlatformFallbackInfo(url: string, platform: string, videoId: string): Promise<any> {
  console.log(`Getting fallback info for ${platform} video ${videoId}`)

  // Generate a random user agent
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
  ]
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  try {
    switch (platform) {
      case "youtube":
        try {
          const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
            {
              headers: {
                "User-Agent": randomUserAgent,
                "Accept-Language": "en-US,en;q=0.9",
                Accept: "application/json",
                Referer: "https://www.google.com/",
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            return {
              title: data.title,
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              uploader: data.author_name,
              duration: 0,
              view_count: 0,
            }
          }
        } catch (error) {
          console.error("YouTube oembed fallback failed:", error)
        }
        break

      case "tiktok":
        try {
          // Try to get TikTok info from a different endpoint
          const username = url.match(/@([^/]+)/)?.[1] || "user"
          return {
            title: `TikTok Video by @${username} (ID: ${videoId})`,
            thumbnail: null,
            uploader: `@${username}`,
            duration: 0,
            view_count: 0,
          }
        } catch (error) {
          console.error("TikTok fallback failed:", error)
        }
        break

      case "facebook":
        // For Facebook, try to extract more info from the URL
        try {
          const urlObj = new URL(url)
          const pageNameMatch = url.match(/facebook\.com\/([^/]+)/i)
          const pageName = pageNameMatch ? pageNameMatch[1] : "page"

          return {
            title: `Facebook Video from ${pageName} (ID: ${videoId})`,
            thumbnail: null,
            uploader: pageName !== "watch" ? pageName : "Facebook User",
            duration: 0,
            view_count: 0,
          }
        } catch (error) {
          console.error("Facebook fallback failed:", error)
        }
        break

      case "instagram":
        try {
          // Try to extract username from URL
          const usernameMatch = url.match(/instagram\.com\/([^/]+)/i)
          const username =
            usernameMatch && usernameMatch[1] !== "p" && usernameMatch[1] !== "reel" ? usernameMatch[1] : "user"

          return {
            title: `Instagram ${url.includes("/reel/") ? "Reel" : "Post"} (ID: ${videoId})`,
            thumbnail: null,
            uploader: username !== "p" ? `@${username}` : "Instagram User",
            duration: 0,
            view_count: 0,
          }
        } catch (error) {
          console.error("Instagram fallback failed:", error)
        }
        break

      case "snapchat":
        try {
          return {
            title: `Snapchat Story (ID: ${videoId})`,
            thumbnail: null,
            uploader: "Snapchat User",
            duration: 0,
            view_count: 0,
          }
        } catch (error) {
          console.error("Snapchat fallback failed:", error)
        }
        break
    }

    // Default fallback
    return {
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video (ID: ${videoId})`,
      thumbnail: platform === "youtube" ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
      uploader: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
      duration: 0,
      view_count: 0,
    }
  } catch (error) {
    console.error(`Error in platform fallback for ${platform}:`, error)
    return {
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video (ID: ${videoId})`,
      thumbnail: platform === "youtube" ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
      uploader: "Unknown",
      duration: 0,
      view_count: 0,
    }
  }
}

// Add this helper function to run yt-dlp when other methods fail
async function getInfoWithYtDlp(url: string, retryCount = 0): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create cookies file
      const cookiesPath = await createCookiesFile()

      // Use environment variable for yt-dlp path with fallback
      const ytDlpPath: string = config.ytdl.ytDlpPath

      console.log(`Using yt-dlp from: ${ytDlpPath}`)

      // Generate a random user agent
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
      ]
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

      // Add cookies and user-agent to bypass detection
      const args = [
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        "--cookies",
        cookiesPath,
        "--user-agent",
        randomUserAgent,
        "--add-header",
        "Accept-Language:en-US,en;q=0.9",
        "--add-header",
        "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "--add-header",
        "Sec-Fetch-Mode:navigate",
        "--add-header",
        "Sec-Fetch-Site:none",
        "--add-header",
        "Sec-Fetch-User:?1",
        "--add-header",
        "Upgrade-Insecure-Requests:1",
        "--geo-bypass",
        "--no-check-certificate",
        "--extractor-retries",
        "3", // Reduced from 5 to 3
        "--sleep-requests",
        "0", // Reduced from 1 to 0
        "--sleep-interval",
        "0", // Reduced from 1 to 0
        "--max-sleep-interval",
        "1", // Reduced from 5 to 1
        "--ignore-errors",
        "--socket-timeout",
        "15", // Reduced from 30 to 15
      ]

      // Add proxy if available
      const proxyArgs = proxyManager.getProxyArgs()
      if (proxyArgs.length > 0) {
        args.push(...proxyArgs)
        console.log(`Using proxy: ${proxyArgs.join(" ")}`)
      }

      // Add URL as the last argument
      args.push(url)

      console.log(`Executing: ${ytDlpPath} ${args.join(" ")}`)

      // Spawn yt-dlp process
      const ytDlpProcess = spawn(ytDlpPath, args)

      let output = ""
      let errorOutput = ""

      ytDlpProcess.stdout.on("data", (data: Buffer) => {
        output += data.toString()
      })

      ytDlpProcess.stderr.on("data", (data: Buffer) => {
        errorOutput += data.toString()
        console.log(`yt-dlp stderr: ${data.toString()}`)
      })

      ytDlpProcess.on("close", async (code: number | null) => {
        console.log(`yt-dlp process exited with code ${code}`)
        if (code === 0 && output.trim()) {
          try {
            const info = JSON.parse(output.trim())
            resolve({
              title: info.title,
              thumbnail: info.thumbnail,
              duration: info.duration,
              uploader: info.uploader,
              view_count: info.view_count || 0,
            })
          } catch (error) {
            console.error("Error parsing yt-dlp output:", error)
            reject(new Error("Failed to parse video information"))
          }
        } else {
          console.error(`yt-dlp exited with code ${code}: ${errorOutput}`)
          reject(new Error(`Failed to get video info with yt-dlp: ${errorOutput}`))
        }
      })

      ytDlpProcess.on("error", (err: Error) => {
        console.error(`Failed to start yt-dlp: ${err.message}`)
        reject(err)
      })

      // Add timeout - reduced from 30 to 15 seconds
      const timeoutId = setTimeout(() => {
        ytDlpProcess.kill()
        reject(new Error("yt-dlp process timed out"))
      }, 15000)

      // Clear timeout when process ends
      ytDlpProcess.on("close", () => {
        clearTimeout(timeoutId)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Add these helper functions before the POST function

// Function to extract metadata from HTML
async function extractMetadataFromHtml(url: string, platform: string): Promise<any> {
  try {
    // Generate a random user agent
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
    ]
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

    // Try to use a proxy if available
    const proxyUrl = proxyManager.getCurrentProxy()
    let agent

    if (proxyUrl) {
      if (proxyUrl.startsWith("socks")) {
        agent = new SocksProxyAgent(proxyUrl)
      } else {
        agent = new HttpsProxyAgent(proxyUrl)
      }
    }

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
      agent,
      timeout: 10000,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata based on platform
    let title = ""
    let thumbnail = null
    let uploader = ""
    let duration = 0
    let viewCount = 0

    // Common meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute("content")
    const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute("content")

    // Set title from meta tags
    title = ogTitle || twitterTitle || document.title || `${platform} Video`

    // Set thumbnail from meta tags
    thumbnail = ogImage || twitterImage || null

    // Platform-specific extraction
    switch (platform) {
      case "youtube":
        // Try to extract uploader from meta tags or schema.org data
        uploader =
          document.querySelector('meta[name="author"]')?.getAttribute("content") ||
          document.querySelector('span[itemprop="author"] [itemprop="name"]')?.textContent ||
          "YouTube User"

        // Try to extract duration
        const ytDurationMeta = document.querySelector('meta[itemprop="duration"]')?.getAttribute("content")
        if (ytDurationMeta) {
          // Parse ISO 8601 duration format (PT1H2M3S)
          const match = ytDurationMeta.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
          if (match) {
            const hours = Number.parseInt(match[1] || "0")
            const minutes = Number.parseInt(match[2] || "0")
            const seconds = Number.parseInt(match[3] || "0")
            duration = hours * 3600 + minutes * 60 + seconds
          }
        }

        // Try to extract view count
        const viewCountText = document.querySelector('[itemprop="interactionCount"]')?.getAttribute("content")
        if (viewCountText) {
          viewCount = Number.parseInt(viewCountText)
        }
        break

      case "facebook":
        // Facebook doesn't expose much metadata in HTML, but we can try
        uploader = document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") || "Facebook User"
        break

      case "instagram":
        // Try to extract username from various elements
        uploader =
          document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ||
          document.querySelector('meta[property="instapp:owner_user_id"]')?.getAttribute("content") ||
          "Instagram User"
        break

      case "tiktok":
        // Try to extract username
        uploader =
          document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ||
          document.querySelector('meta[name="author"]')?.getAttribute("content") ||
          "TikTok User"
        break

      case "snapchat":
        // Try to extract username or creator info
        uploader =
          document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ||
          document.querySelector('meta[name="author"]')?.getAttribute("content") ||
          "Snapchat User"

        // Try to find duration in description or other meta tags
        const descriptionText = ogDescription || ""
        const durationMatch = descriptionText.match(/(\d+):(\d+)/)
        if (durationMatch) {
          const minutes = Number.parseInt(durationMatch[1])
          const seconds = Number.parseInt(durationMatch[2])
          duration = minutes * 60 + seconds
        }
        break
    }

    return {
      title,
      thumbnail,
      uploader,
      duration,
      view_count: viewCount,
    }
  } catch (error) {
    console.error(`Error extracting metadata from HTML for ${platform}:`, error)
    return null
  }
}

// Function to get video info from multiple sources in parallel
async function getVideoInfoFromMultipleSources(url: string, platform: string, videoId: string): Promise<any> {
  try {
    // Start all methods in parallel
    const results = await Promise.allSettled([
      // Method 1: Try yt-dlp with a short timeout
      getInfoWithTimeout(() => getInfoWithYtDlp(url), 10000).catch(() => null),

      // Method 2: Try platform-specific fallback
      getPlatformFallbackInfo(url, platform, videoId),

      // Method 3: Try HTML metadata extraction
      extractMetadataFromHtml(url, platform).catch(() => null),

      // Method 4: For YouTube, try ytdl-core
      platform === "youtube" && ytdl.validateURL(url)
        ? getInfoWithTimeout(async () => {
            const info = await ytdl.getBasicInfo(url)
            return {
              title: info.videoDetails.title,
              thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
              duration: Number.parseInt(info.videoDetails.lengthSeconds),
              uploader: info.videoDetails.author.name,
              view_count: Number.parseInt(info.videoDetails.viewCount),
            }
          }, 5000).catch(() => null)
        : Promise.resolve(null),
    ])

    // Combine results, prioritizing more complete information
    const combinedInfo: any = {
      title: null,
      thumbnail: null,
      duration: 0,
      uploader: null,
      view_count: 0,
    }

    // Process results in order of preference
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        const info = result.value

        // Only use fields that aren't already set or are better quality
        if (!combinedInfo.title && info.title) combinedInfo.title = info.title
        if (!combinedInfo.thumbnail && info.thumbnail) combinedInfo.thumbnail = info.thumbnail
        if (!combinedInfo.uploader && info.uploader) combinedInfo.uploader = info.uploader

        // For numeric fields, use the highest value
        if (info.duration && (!combinedInfo.duration || info.duration > combinedInfo.duration)) {
          combinedInfo.duration = info.duration
        }

        if (info.view_count && (!combinedInfo.view_count || info.view_count > combinedInfo.view_count)) {
          combinedInfo.view_count = info.view_count
        }
      }
    }

    // If we still don't have a title, create one from the platform and ID
    if (!combinedInfo.title) {
      combinedInfo.title = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video (ID: ${videoId})`
    }

    // If we still don't have an uploader, create a generic one
    if (!combinedInfo.uploader) {
      combinedInfo.uploader = `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`
    }

    return combinedInfo
  } catch (error) {
    console.error(`Error getting video info from multiple sources:`, error)

    // Return basic fallback info
    return {
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video (ID: ${videoId})`,
      thumbnail: platform === "youtube" ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
      uploader: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
      duration: 0,
      view_count: 0,
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    const info = await getInfoWithYtDlp(url)
    return NextResponse.json(info)
  } catch (error: any) {
    console.error("Error getting video info:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Modify the POST function to use the new approach
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Check cache first
    const cacheKey = url
    const cachedInfo = videoInfoCache.get(cacheKey)
    if (cachedInfo && Date.now() - cachedInfo.timestamp < CACHE_TTL) {
      console.log(`Using cached info for ${url}`)
      return NextResponse.json(cachedInfo.data)
    }

    // Detect platform
    const platform = detectPlatform(url)
    if (!platform) {
      return NextResponse.json({ error: "Unsupported platform or invalid URL" }, { status: 400 })
    }

    console.log(`Processing video info request for ${platform}: ${url}`)

    // Extract video ID first for fallback
    const videoId = extractVideoId(url, platform)
    if (!videoId) {
      return NextResponse.json({ error: "Could not extract video ID" }, { status: 400 })
    }

    // Get basic fallback info immediately
    const fallbackInfo = await getPlatformFallbackInfo(url, platform, videoId)

    // Return fallback info immediately and start fetching better info in the background
    const response = NextResponse.json(fallbackInfo)

    // Start fetching better info in the background
    try {
      // Try to get comprehensive info from multiple sources
      getVideoInfoFromMultipleSources(url, platform, videoId)
        .then((betterInfo) => {
          videoInfoCache.set(cacheKey, { data: betterInfo, timestamp: Date.now() })
          console.log(`Updated cache with better info for ${url}`)
        })
        .catch((error) => {
          console.error(`Background fetch failed for ${url}:`, error)
          // Still cache the fallback info
          videoInfoCache.set(cacheKey, { data: fallbackInfo, timestamp: Date.now() })
        })
    } catch (error) {
      console.error(`Error in background fetch for ${url}:`, error)
    }

    return response
  } catch (error: any) {
    console.error("Error fetching video info:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch video information",
      },
      { status: 500 },
    )
  }
}
