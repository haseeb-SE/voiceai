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

  if (url.includes("tiktok.com") || url.includes("vt.tiktok.com")) {
    return "tiktok"
  } else if (url.includes("instagram.com")) {
    return "instagram"
  } else if (url.includes("facebook.com")) {
    return "facebook"
  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube"
  } else if (url.includes("twitter.com")) {
    return "twitter"
  } else if (url.includes("x.com")) {
    return "twitter"
  } else if (url.includes("snapchat.com")) {
    return "snapchat"
  }
  return null
}

// Add this function after detectPlatform and before getPlatformButtonColor

/**
 * Extract video ID from URL based on platform
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
        // Handle youtube.com/watch?v=ID and youtu.be/ID formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
      }

      case "tiktok": {
        // Handle TikTok URLs
        const regExp = /tiktok\.com\/.*\/video\/(\d+)/
        const match = url.match(regExp)
        if (match && match[1]) return match[1]

        // Handle shortened TikTok URLs (vt.tiktok.com)
        const shortVtMatch = url.match(/vt\.tiktok\.com\/([^/?]+)/)
        if (shortVtMatch) return shortVtMatch[1]

        // Handle other shortened TikTok URLs
        const shortMatch = url.match(/tiktok\.com\/(@[^/]+)\/([^/?]+)/)
        return shortMatch ? shortMatch[2] : null
      }

      case "facebook": {
        // Handle various Facebook video URL formats
        const watchMatch = url.match(/facebook\.com\/watch\/?\?v=(\d+)/)
        if (watchMatch) return watchMatch[1]

        const videoMatch = url.match(/facebook\.com\/[^/]+\/videos\/(\d+)/)
        if (videoMatch) return videoMatch[1]

        const storyMatch = url.match(/facebook\.com\/stories\/[^/]+\/(\d+)/)
        if (storyMatch) return storyMatch[1]

        // If no specific pattern matches, use the last path segment
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null
      }

      case "instagram": {
        // Handle Instagram post, reel, and story URLs
        const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/)
        if (postMatch) return postMatch[1]

        const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/)
        if (reelMatch) return reelMatch[1]

        const storyMatch = url.match(/instagram\.com\/stories\/[^/]+\/(\d+)/)
        if (storyMatch) return storyMatch[1]

        // If no specific pattern matches, use the last path segment
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null
      }

      case "twitter": {
        // Handle Twitter/X URLs
        const statusMatch = url.match(/twitter\.com\/[^/]+\/status\/(\d+)/)
        if (statusMatch) return statusMatch[1]

        const xMatch = url.match(/x\.com\/[^/]+\/status\/(\d+)/)
        if (xMatch) return xMatch[1]

        // If no specific pattern matches, use the last path segment
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null
      }

      case "snapchat": {
        // Handle Snapchat URLs
        const storyMatch = url.match(/snapchat\.com\/[^/]+\/([^/?]+)/)
        if (storyMatch) return storyMatch[1]

        // Handle spotlight URLs
        const spotlightMatch = url.match(/snapchat\.com\/spotlight\/([^/?]+)/)
        if (spotlightMatch) return spotlightMatch[1]

        // If no specific pattern matches, use the last path segment
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null
      }

      default:
        // For other platforms, try to extract the last path segment as ID
        try {
          const urlObj = new URL(url)
          const pathParts = urlObj.pathname.split("/").filter(Boolean)
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
  // Dynamic import to avoid bundling issues
  const puppeteer = await import("puppeteer")

  const browser = await puppeteer.default.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  const page = await browser.newPage()

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 })

    let videoInfo: VideoInfo | null = null

    if (platform === "instagram") {
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
    } else if (platform === "facebook") {
      // Wait for Facebook content to load
      await sleep(3000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "Facebook Video"

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
          title: title.replace(" | Facebook", "").trim(),
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
    } else if (platform === "twitter") {
      // Wait for Twitter content to load
      await sleep(3000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "Twitter Video"

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
          title: title.replace(" | Twitter", "").trim(),
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
    await browser.close()
  }
}
