// This file should only be used on the server side
// Remove direct puppeteer import to avoid client-side bundling issues

interface VideoInfo {
  title: string
  streamUrls: string[]
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function detectPlatform(url: string): string | null {
  if (!url) return null

  // Clean URL for better detection
  const cleanUrl = url.toLowerCase().trim()

  // Check Snapchat FIRST to avoid conflicts with other platforms
  if (cleanUrl.includes("snapchat.com") || cleanUrl.includes("snap.com")) {
    return "snapchat"
  } else if (
    cleanUrl.includes("tiktok.com") ||
    cleanUrl.includes("vt.tiktok.com") ||
    cleanUrl.includes("vm.tiktok.com")
  ) {
    return "tiktok"
  } else if (cleanUrl.includes("instagram.com") || cleanUrl.includes("instagr.am")) {
    return "instagram"
  } else if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch") || cleanUrl.includes("fb.com")) {
    return "facebook"
  } else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("m.youtube.com")) {
    return "youtube"
  }
  return null
}

/**
 * Extract video ID from URL based on platform - Enhanced to handle all video types
 */
export function extractVideoId(url: string, platform: string | null = null): string | null {
  if (!url) return null

  if (!platform) {
    platform = detectPlatform(url)
  }

  if (!platform) return null

  try {
    switch (platform) {
      case "youtube": {
        // Handle all YouTube URL formats including Shorts

        // YouTube Shorts: /shorts/VIDEO_ID
        const shortsMatch = url.match(/(?:youtube\.com|youtu\.be|m\.youtube\.com)\/shorts\/([a-zA-Z0-9_-]{11})/)
        if (shortsMatch) return shortsMatch[1]

        // Standard YouTube: /watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
        if (watchMatch) return watchMatch[1]

        // YouTube short URL: youtu.be/VIDEO_ID
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
        if (shortMatch) return shortMatch[1]

        // YouTube embed: /embed/VIDEO_ID
        const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
        if (embedMatch) return embedMatch[1]

        // YouTube live: /live/VIDEO_ID
        const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/)
        if (liveMatch) return liveMatch[1]

        // YouTube channel video: /c/CHANNEL/VIDEO_ID or /user/USER/VIDEO_ID
        const channelMatch = url.match(/youtube\.com\/(?:c|user|channel)\/[^/]+\/.*[?&]v=([a-zA-Z0-9_-]{11})/)
        if (channelMatch) return channelMatch[1]

        // Fallback: try to find any 11-character alphanumeric string that looks like a YouTube ID
        const fallbackMatch = url.match(/([a-zA-Z0-9_-]{11})/)
        if (fallbackMatch && fallbackMatch[1]) {
          // Verify it's likely a YouTube ID (contains mix of letters/numbers)
          const id = fallbackMatch[1]
          if (/[a-zA-Z]/.test(id) && /[0-9]/.test(id)) {
            return id
          }
        }

        return null
      }

      case "tiktok": {
        // Handle all TikTok URL formats

        // Standard TikTok video: /video/VIDEO_ID
        const videoMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/)
        if (videoMatch) return videoMatch[1]

        // TikTok user video: /@username/video/VIDEO_ID
        const userVideoMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)
        if (userVideoMatch) return userVideoMatch[1]

        // Shortened TikTok URLs (vt.tiktok.com, vm.tiktok.com)
        const shortVtMatch = url.match(/(?:vt|vm)\.tiktok\.com\/([a-zA-Z0-9]+)/)
        if (shortVtMatch) return shortVtMatch[1]

        // TikTok share URLs
        const shareMatch = url.match(/tiktok\.com\/t\/([a-zA-Z0-9]+)/)
        if (shareMatch) return shareMatch[1]

        // TikTok user profile with video
        const profileMatch = url.match(/tiktok\.com\/@([^/]+)\/([^/?]+)/)
        if (profileMatch) return profileMatch[2]

        // Extract from any TikTok URL as fallback
        const fallbackMatch = url.match(/tiktok\.com\/.*\/([a-zA-Z0-9]+)/)
        if (fallbackMatch) return fallbackMatch[1]

        return null
      }

      case "facebook": {
        // Handle all Facebook video URL formats with enhanced patterns

        // Facebook Watch: /watch?v=VIDEO_ID
        const watchMatch = url.match(/facebook\.com\/watch\/?\?v=(\d+)/)
        if (watchMatch) return watchMatch[1]

        // Facebook video: /videos/VIDEO_ID
        const videoMatch = url.match(/facebook\.com\/[^/]+\/videos\/(\d+)/)
        if (videoMatch) return videoMatch[1]

        // Facebook story: /stories/USER/STORY_ID
        const storyMatch = url.match(/facebook\.com\/stories\/[^/]+\/(\d+)/)
        if (storyMatch) return storyMatch[1]

        // Facebook reel: /reel/REEL_ID
        const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/)
        if (reelMatch) return reelMatch[1]

        // Facebook short URL: fb.watch/VIDEO_ID
        const fbWatchMatch = url.match(/fb\.watch\/([a-zA-Z0-9]+)/)
        if (fbWatchMatch) return fbWatchMatch[1]

        // Facebook permalink: /permalink.php?story_fbid=ID
        const permalinkMatch = url.match(/story_fbid=(\d+)/)
        if (permalinkMatch) return permalinkMatch[1]

        // Facebook video with additional parameters
        const paramVideoMatch = url.match(/facebook\.com\/.*\/videos\/.*\/(\d+)/)
        if (paramVideoMatch) return paramVideoMatch[1]

        // Facebook share URLs: /share/r/VIDEO_ID (Enhanced pattern)
        const shareMatch = url.match(/facebook\.com\/share\/r\/([A-Za-z0-9_-]+)/)
        if (shareMatch) return shareMatch[1]

        // Facebook share URLs with additional parameters
        const shareParamMatch = url.match(/facebook\.com\/share\/.*[?&]id=([A-Za-z0-9_-]+)/)
        if (shareParamMatch) return shareParamMatch[1]

        // Facebook groups video: /groups/GROUP_ID/permalink/POST_ID
        const groupMatch = url.match(/facebook\.com\/groups\/[^/]+\/permalink\/(\d+)/)
        if (groupMatch) return groupMatch[1]

        // Facebook page video: /PAGE_NAME/videos/VIDEO_ID
        const pageVideoMatch = url.match(/facebook\.com\/[^/]+\/videos\/[^/]*\/(\d+)/)
        if (pageVideoMatch) return pageVideoMatch[1]

        // Extract any long alphanumeric ID as fallback (Facebook IDs are typically long)
        const longIdMatch = url.match(/([A-Za-z0-9_-]{15,})/)
        if (longIdMatch) return longIdMatch[1]

        // Extract any numeric ID as final fallback
        const numericMatch = url.match(/(\d{10,})/)
        if (numericMatch) return numericMatch[1]

        return null
      }

      case "instagram": {
        // Handle all Instagram content types

        // Instagram post: /p/POST_ID
        const postMatch = url.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/)
        if (postMatch) return postMatch[1]

        // Instagram reel: /reel/REEL_ID
        const reelMatch = url.match(/instagram\.com\/reel\/([a-zA-Z0-9_-]+)/)
        if (reelMatch) return reelMatch[1]

        // Instagram TV: /tv/TV_ID
        const tvMatch = url.match(/instagram\.com\/tv\/([a-zA-Z0-9_-]+)/)
        if (tvMatch) return tvMatch[1]

        // Instagram story: /stories/USERNAME/STORY_ID
        const storyMatch = url.match(/instagram\.com\/stories\/[^/]+\/(\d+)/)
        if (storyMatch) return storyMatch[1]

        // Instagram story highlight: /stories/highlights/HIGHLIGHT_ID
        const highlightMatch = url.match(/instagram\.com\/stories\/highlights\/(\d+)/)
        if (highlightMatch) return highlightMatch[1]

        // Short Instagram URL: instagr.am/p/POST_ID
        const shortMatch = url.match(/instagr\.am\/p\/([a-zA-Z0-9_-]+)/)
        if (shortMatch) return shortMatch[1]

        // Extract any alphanumeric ID as fallback
        const fallbackMatch = url.match(/\/([a-zA-Z0-9_-]{8,})/)
        if (fallbackMatch) return fallbackMatch[1]

        return null
      }

      case "snapchat": {
        // Handle all Snapchat content types

        // Snapchat story: /add/USERNAME or /u/USERNAME
        const userMatch = url.match(/snapchat\.com\/(?:add|u)\/([a-zA-Z0-9._-]+)/)
        if (userMatch) return userMatch[1]

        // Snapchat spotlight: /spotlight/SPOTLIGHT_ID
        const spotlightMatch = url.match(/snapchat\.com\/spotlight\/([a-zA-Z0-9_-]+)/)
        if (spotlightMatch) return spotlightMatch[1]

        // Snapchat discover: /discover/STORY_ID
        const discoverMatch = url.match(/snapchat\.com\/discover\/([a-zA-Z0-9_-]+)/)
        if (discoverMatch) return discoverMatch[1]

        // Snapchat lens: /lens/LENS_ID
        const lensMatch = url.match(/snapchat\.com\/lens\/([a-zA-Z0-9_-]+)/)
        if (lensMatch) return lensMatch[1]

        // Snapchat unlock: /unlock/?type=SNAP_CODE
        const unlockMatch = url.match(/snapchat\.com\/unlock\/.*[?&](?:type|code)=([a-zA-Z0-9_-]+)/)
        if (unlockMatch) return unlockMatch[1]

        // Extract any alphanumeric ID as fallback
        const fallbackMatch = url.match(/snapchat\.com\/[^/]*\/([a-zA-Z0-9_-]+)/)
        if (fallbackMatch) return fallbackMatch[1]

        return null
      }

      default:
        // For other platforms, try to extract meaningful ID
        try {
          const urlObj = new URL(url)
          const pathParts = urlObj.pathname.split("/").filter(Boolean)

          // Look for video-like patterns in path
          for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i]
            // If we find 'video', 'watch', 'v', etc., the next part might be the ID
            if (["video", "watch", "v", "embed", "shorts"].includes(part.toLowerCase()) && pathParts[i + 1]) {
              return pathParts[i + 1]
            }
          }

          // Return the last meaningful path segment
          return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null
        } catch (e) {
          return null
        }
    }
  } catch (error) {
    console.error(`Error extracting video ID for ${platform}:`, error)
    return null
  }
}

// Add the missing platform color functions
export function getPlatformButtonColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "bg-red-600 hover:bg-red-700"
    case "facebook":
      return "bg-blue-600 hover:bg-blue-700"
    case "instagram":
      return "bg-pink-600 hover:bg-pink-700"
    case "tiktok":
      return "bg-teal-600 hover:bg-teal-700"
    case "snapchat":
      return "bg-yellow-500 hover:bg-yellow-600"
    default:
      return "bg-gray-600 hover:bg-gray-700"
  }
}

export function getPlatformBorderColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "border-red-600"
    case "facebook":
      return "border-blue-600"
    case "instagram":
      return "border-pink-600"
    case "tiktok":
      return "border-teal-600"
    case "snapchat":
      return "border-yellow-500"
    default:
      return "border-gray-600"
  }
}

export function getPlatformTextColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "text-red-600"
    case "facebook":
      return "text-blue-600"
    case "instagram":
      return "text-pink-600"
    case "tiktok":
      return "text-teal-600"
    case "snapchat":
      return "text-yellow-500"
    default:
      return "text-gray-600"
  }
}

// Enhanced Facebook video extraction with multiple strategies
async function extractFacebookVideo(url: string, page: any): Promise<VideoInfo | null> {
  console.log("Starting enhanced Facebook video extraction...")

  try {
    // Wait for content to load
    await sleep(5000)

    const videoInfo = await page.evaluate(() => {
      const streams: string[] = []
      let title = "Facebook Video"

      // Strategy 1: Get title from various sources
      const titleSources = [
        document.querySelector("title")?.textContent,
        document.querySelector('[data-testid="post_message"]')?.textContent,
        document.querySelector('[data-ad-preview="message"]')?.textContent,
        document.querySelector("h1")?.textContent,
        document.querySelector('[role="main"] h2')?.textContent,
      ]

      for (const source of titleSources) {
        if (source && source.trim() && !source.includes("Facebook")) {
          title = source.trim()
          break
        }
      }

      // Strategy 2: Extract video URLs from DOM elements
      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        if (video.src && !video.src.startsWith("blob:") && !video.src.startsWith("data:")) {
          streams.push(video.src)
        }

        video.querySelectorAll("source").forEach((source) => {
          if (source.src && !source.src.startsWith("blob:") && !source.src.startsWith("data:")) {
            streams.push(source.src)
          }
        })
      })

      // Strategy 3: Extract from script tags with enhanced patterns
      const scripts = document.querySelectorAll("script")
      scripts.forEach((script) => {
        const content = script.textContent || ""

        // Enhanced Facebook video URL patterns
        const patterns = [
          /"hd_src":"([^"]+)"/g,
          /"sd_src":"([^"]+)"/g,
          /"video_url":"([^"]+)"/g,
          /"playable_url":"([^"]+)"/g,
          /"playable_url_quality_hd":"([^"]+)"/g,
          /"browser_native_hd_url":"([^"]+)"/g,
          /"browser_native_sd_url":"([^"]+)"/g,
          /https:\/\/[^"]*\.facebook\.com[^"]*\.mp4[^"]*/g,
          /https:\/\/[^"]*\.fbcdn\.net[^"]*\.mp4[^"]*/g,
          /https:\/\/[^"]*video[^"]*\.mp4[^"]*/g,
        ]

        patterns.forEach((pattern) => {
          const matches = content.match(pattern)
          if (matches) {
            matches.forEach((match) => {
              let url = match
                .replace(/"hd_src":"/, "")
                .replace(/"sd_src":"/, "")
                .replace(/"video_url":"/, "")
                .replace(/"playable_url":"/, "")
                .replace(/"playable_url_quality_hd":"/, "")
                .replace(/"browser_native_hd_url":"/, "")
                .replace(/"browser_native_sd_url":"/, "")
                .replace(/"/g, "")

              // Decode URL
              url = decodeURIComponent(url.replace(/\\u0026/g, "&").replace(/\\/g, ""))

              if (
                url &&
                !url.startsWith("blob:") &&
                !url.startsWith("data:") &&
                (url.includes(".mp4") || url.includes("video")) &&
                url.startsWith("http")
              ) {
                streams.push(url)
              }
            })
          }
        })
      })

      // Strategy 4: Look for data attributes
      document.querySelectorAll("[data-video-url], [data-src]").forEach((element) => {
        const videoUrl = element.getAttribute("data-video-url") || element.getAttribute("data-src")
        if (videoUrl && videoUrl.includes(".mp4") && videoUrl.startsWith("http")) {
          streams.push(videoUrl)
        }
      })

      return {
        title: title.replace(" | Facebook", "").replace(" - Facebook", "").trim(),
        streamUrls: Array.from(new Set(streams)).filter(
          (url) =>
            url &&
            !url.startsWith("blob:") &&
            !url.startsWith("data:") &&
            url.startsWith("http") &&
            (url.includes(".mp4") || url.includes("video")),
        ),
      }
    })

    console.log(`Facebook extraction found ${videoInfo.streamUrls.length} video URLs`)
    return videoInfo
  } catch (error) {
    console.error("Facebook video extraction error:", error)
    return null
  }
}

// Server-side only function - use dynamic import for puppeteer
export async function detectPlatformAndExtract(
  url: string,
  platform: string | null = null,
  usePuppeteerFallback = true,
): Promise<VideoInfo | null> {
  // This function should only be called on the server side
  if (typeof window !== "undefined") {
    throw new Error("detectPlatformAndExtract can only be used on the server side")
  }

  if (!platform) {
    platform = detectPlatform(url)
  }

  if (!platform) {
    console.warn("Could not detect platform from URL.")
    return null
  }

  try {
    if (usePuppeteerFallback) {
      return await puppeteerFallback(url, platform)
    } else {
      console.warn("Puppeteer fallback disabled.")
      return null
    }
  } catch (error) {
    console.error("Error during Puppeteer fallback:", error)
    return null
  }
}

async function puppeteerFallback(url: string, platform: string): Promise<VideoInfo | null> {
  let browser = null

  try {
    // Try to use puppeteer-extra with stealth plugin first
    let puppeteer
    try {
      puppeteer = await import("puppeteer-extra")
      const StealthPlugin = await import("puppeteer-extra-plugin-stealth")
      puppeteer.default.use(StealthPlugin.default())
      console.log("Using puppeteer-extra with stealth plugin")
    } catch (stealthError) {
      console.log("Stealth plugin not available, using regular puppeteer")
      puppeteer = await import("puppeteer")
    }

    // Enhanced browser launch options
    const launchOptions = {
      headless: "new" as const,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-blink-features=AutomationControlled",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-default-apps",
        "--disable-hang-monitor",
        "--disable-prompt-on-repost",
        "--disable-sync",
        "--disable-translate",
        "--metrics-recording-only",
        "--no-first-run",
        "--safebrowsing-disable-auto-update",
        "--enable-automation",
        "--password-store=basic",
        "--use-mock-keychain",
      ],
    }

    // Try to install Chrome if not found
    try {
      browser = await puppeteer.default.launch(launchOptions)
    } catch (chromeError) {
      console.log("Chrome not found, attempting to install...")
      try {
        // Try to install Chrome using puppeteer
        const { install } = await import("@puppeteer/browsers")
        await install({
          browser: "chrome",
          buildId: "latest",
        })
        browser = await puppeteer.default.launch(launchOptions)
      } catch (installError) {
        console.error("Failed to install Chrome:", installError)
        throw new Error("Chrome browser not available and installation failed")
      }
    }

    const page = await browser.newPage()

    // Set realistic user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    )
    await page.setViewport({ width: 1920, height: 1080 })

    // Set extra headers
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    })

    // Navigate to the URL with extended timeout
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })

    let videoInfo: VideoInfo | null = null

    if (platform === "facebook") {
      videoInfo = await extractFacebookVideo(url, page)
    } else if (platform === "instagram") {
      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "Instagram Video"
        document.querySelectorAll("video").forEach((v) => {
          if (v.src && !v.src.startsWith("blob:")) {
            streams.push(v.src)
          }
        })
        return {
          title: title.replace(" | Instagram", "").trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) => url && !url.startsWith("blob:") && !url.startsWith("data:"),
          ),
        }
      })
    } else if (platform === "youtube") {
      // Wait for YouTube content to load
      await sleep(3000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "YouTube Video"

        // Look for video elements
        document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
          if (v.src && !v.src.startsWith("blob:")) {
            streams.push(v.src)
          }
          v.querySelectorAll("source").forEach((s) => {
            if (s.src && !s.src.startsWith("blob:")) {
              streams.push(s.src)
            }
          })
        })

        return {
          title: title.replace(" - YouTube", "").trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) => url && !url.startsWith("blob:") && !url.startsWith("data:"),
          ),
        }
      })
    } else if (platform === "tiktok") {
      // Wait for TikTok content to load
      await sleep(2000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "TikTok Video"

        // Look for video elements
        document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
          if (v.src && !v.src.startsWith("blob:")) {
            streams.push(v.src)
          }
          v.querySelectorAll("source").forEach((s) => {
            if (s.src && !s.src.startsWith("blob:")) {
              streams.push(s.src)
            }
          })
        })

        // Look for TikTok video URLs in scripts
        const scripts = document.querySelectorAll("script")
        scripts.forEach((script) => {
          const content = script.textContent || ""

          // TikTok video URL patterns
          const videoMatches =
            content.match(/"playAddr":"([^"]+)"/g) ||
            content.match(/"downloadAddr":"([^"]+)"/g) ||
            content.match(/https:\/\/[^"]*\.tiktok\.com[^"]*\.mp4[^"]*/g)

          if (videoMatches) {
            videoMatches.forEach((match) => {
              let url = match
                .replace(/"playAddr":"/, "")
                .replace(/"downloadAddr":"/, "")
                .replace(/"/g, "")
              url = decodeURIComponent(url.replace(/\\u0026/g, "&"))
              if (url && !url.startsWith("blob:") && url.includes(".mp4")) {
                streams.push(url)
              }
            })
          }
        })

        return {
          title: title.replace(" | TikTok", "").trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) => url && !url.startsWith("blob:") && !url.startsWith("data:"),
          ),
        }
      })
    } else if (platform === "snapchat") {
      // Wait for Snapchat content to load
      await sleep(3000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "Snapchat Story"

        // Look for video elements
        document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
          if (v.src && !v.src.startsWith("blob:")) {
            streams.push(v.src)
          }
          v.querySelectorAll("source").forEach((s) => {
            if (s.src && !s.src.startsWith("blob:")) {
              streams.push(s.src)
            }
          })
        })

        // Look for Snapchat video URLs in scripts and data attributes
        const scripts = document.querySelectorAll("script")
        scripts.forEach((script) => {
          const content = script.textContent || ""

          // Snapchat video URL patterns
          const videoMatches =
            content.match(/https:\/\/[^"]*\.sc-cdn\.net[^"]*\.(mp4|webm)[^"]*/g) ||
            content.match(/"mediaUrl":"([^"]+)"/g) ||
            content.match(/"videoUrl":"([^"]+)"/g)

          if (videoMatches) {
            videoMatches.forEach((match) => {
              let url = match
                .replace(/"mediaUrl":"/, "")
                .replace(/"videoUrl":"/, "")
                .replace(/"/g, "")
              url = decodeURIComponent(url.replace(/\\u0026/g, "&"))
              if (url && !url.startsWith("blob:")) {
                streams.push(url)
              }
            })
          }
        })

        return {
          title: title.replace(" | Snapchat", "").trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) => url && !url.startsWith("blob:") && !url.startsWith("data:"),
          ),
        }
      })
    }

    return videoInfo
  } catch (error) {
    console.error("Error during evaluation:", error)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
