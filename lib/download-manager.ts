import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const INVIDIOUS = process.env.INVIDIOUS_BASE_URL || ""
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
]

function pickUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import os from "os"
import { spawn } from "child_process"
import { EventEmitter } from "events"
import { updateProgress } from "@/lib/global-store"
import { config } from "@/lib/config"
import { detectPlatform } from "@/lib/platform-detector"

// Enhanced Puppeteer stealth fallback with platform-specific handling
async function fallbackWithPuppeteerStealth(url: string, taskId: string, platform: string) {
  console.log(`[${taskId}] Attempting Puppeteer stealth fallback for ${platform}: ${url}`)

  try {
    const puppeteer = await import("puppeteer-extra")
    const StealthPlugin = await import("puppeteer-extra-plugin-stealth")
    puppeteer.default.use(StealthPlugin.default())

    const browser = await puppeteer.default.launch({
      headless: true,
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
      ],
    })

    const [page] = await browser.pages()
    await page.setUserAgent(pickUA())
    await page.setViewport({ width: 1920, height: 1080 })

    // Platform-specific headers
    const headers: Record<string, string> = {
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    }

    if (platform === "facebook") {
      headers["Sec-Fetch-Dest"] = "document"
      headers["Cache-Control"] = "max-age=0"
    }

    await page.setExtraHTTPHeaders(headers)

    // Navigate with platform-specific timeout
    const timeout = platform === "facebook" ? 15000 : 10000
    await page.goto(url, { waitUntil: "domcontentloaded", timeout })

    // Platform-specific extraction logic
    let videoInfo: any = {}

    if (platform === "facebook") {
      // Wait for Facebook content to load
      await sleep(3000)

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title =
          document.querySelector("title")?.textContent ||
          document.querySelector('[data-testid="post_message"]')?.textContent ||
          "Facebook Video"

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

        // Look for HD/SD video URLs in page scripts
        const scripts = document.querySelectorAll("script")
        scripts.forEach((script) => {
          const content = script.textContent || ""

          // Facebook video URL patterns
          const hdMatch = content.match(/"hd_src":"([^"]+)"/g)
          const sdMatch = content.match(/"sd_src":"([^"]+)"/g)
          const videoMatch = content.match(/"video_url":"([^"]+)"/g)

          if (hdMatch) {
            hdMatch.forEach((match) => {
              const url = match.replace(/"hd_src":"/, "").replace(/"$/, "")
              if (url && !url.startsWith("blob:")) {
                streams.push(decodeURIComponent(url.replace(/\\u0026/g, "&")))
              }
            })
          }

          if (sdMatch) {
            sdMatch.forEach((match) => {
              const url = match.replace(/"sd_src":"/, "").replace(/"$/, "")
              if (url && !url.startsWith("blob:")) {
                streams.push(decodeURIComponent(url.replace(/\\u0026/g, "&")))
              }
            })
          }

          if (videoMatch) {
            videoMatch.forEach((match) => {
              const url = match.replace(/"video_url":"/, "").replace(/"$/, "")
              if (url && !url.startsWith("blob:")) {
                streams.push(decodeURIComponent(url.replace(/\\u0026/g, "&")))
              }
            })
          }
        })

        return {
          title: title.replace(" | Facebook", "").trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) =>
              url &&
              !url.startsWith("blob:") &&
              !url.startsWith("data:") &&
              (url.includes(".mp4") || url.includes("video")),
          ),
        }
      })
    } else {
      // Generic video extraction for other platforms
      await page.waitForSelector("video", { timeout: 5000 }).catch(() => { })

      videoInfo = await page.evaluate(() => {
        const streams: string[] = []
        const title = document.querySelector("title")?.textContent || "Video"

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
          title: title.trim(),
          streamUrls: Array.from(new Set(streams)).filter(
            (url) => url && !url.startsWith("blob:") && !url.startsWith("data:"),
          ),
        }
      })
    }

    await browser.close()

    if (!videoInfo.streamUrls || videoInfo.streamUrls.length === 0) {
      throw new Error(`No downloadable video URLs found for ${platform}`)
    }

    console.log(`[${taskId}] Puppeteer found ${videoInfo.streamUrls.length} streams for ${platform}`)
    return {
      title: videoInfo.title || `${platform} Video`,
      streamUrls: videoInfo.streamUrls,
      thumbnail:
        platform === "youtube" ? `https://img.youtube.com/vi/${extractVideoIdFromUrl(url)}/hqdefault.jpg` : undefined,
      uploader: "Unknown",
      duration: 0,
      view_count: 0,
    }
  } catch (error) {
    console.error(`[${taskId}] Puppeteer stealth fallback failed for ${platform}:`, error)
    throw error
  }
}

const INSTANCES = (process.env.INVIDIOUS_INSTANCES || "")
  .split(",")
  .map(u => u.trim())
  .filter(Boolean);

function pickInvidiousBase(): string {
  if (!INSTANCES.length) return "";
  return INSTANCES[Math.floor(Math.random() * INSTANCES.length)];
}

// Invidious API fallback (YouTube only)
async function fallbackWithInvidiousAPI(url: string, taskId: string) {
  console.log(`[${taskId}] Attempting Invidious API fallback for ${url}`);
  try {
    const base = pickInvidiousBase();
    if (!base) throw new Error("No Invidious instance configured");

    const videoId = extractVideoIdFromUrl(url);
    if (!videoId) throw new Error("Could not extract video ID");

    const invidiousUrl = `${base}/api/v1/videos/${videoId}`;
    console.log(`[${taskId}] Trying Invidious instance: ${base}`);

    const response = await fetch(invidiousUrl, {
      headers: { "User-Agent": pickUA(), Accept: "application/json" },
    });

    if (response.status === 429) {
      console.warn(`[${taskId}] ${base} rate-limited, skipping`);
      throw new Error("Invidious rate limit");
    }
    if (!response.ok) {
      throw new Error(`Invidious returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`[${taskId}] Successfully got video info from ${base}`);

    return {
      title: data.title || `Video ${videoId}`,
      thumbnail: data.videoThumbnails?.[0]?.url,
      duration: data.lengthSeconds,
      uploader: data.author,
      view_count: data.viewCount || 0,
    };
  } catch (error) {
    console.error(`[${taskId}] Invidious fallback failed:`, error);
    throw error;
  }
}


// Combined fallback method with platform-specific strategies
async function fallbackWithAlternativeMethod(url: string, taskId: string) {
  console.log(`[${taskId}] Attempting alternative fallback methods for ${url}`)

  const platform = detectPlatform(url) || "unknown"
  console.log(`[${taskId}] Detected platform: ${platform}`)

  // Strategy 1: For YouTube, try Invidious API first
  if (platform === "youtube") {
    try {
      return await fallbackWithInvidiousAPI(url, taskId)
    } catch (error) {
      console.log(`[${taskId}] Invidious API failed, trying Puppeteer stealth...`)
    }
  }

  // Strategy 2: Try Puppeteer stealth for all platforms
  try {
    return await fallbackWithPuppeteerStealth(url, taskId, platform)
  } catch (error) {
    console.log(`[${taskId}] Puppeteer stealth failed, using basic fallback...`)
  }

  // Strategy 3: Basic fallback
  const videoId = extractVideoIdFromUrl(url)
  if (videoId && platform === "youtube") {
    return {
      title: `YouTube Video (${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      uploader: "Unknown",
      duration: 0,
      view_count: 0,
    }
  }

  return {
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
    thumbnail: undefined,
    uploader: "Unknown",
    duration: 0,
    view_count: 0,
  }
}

// Helper function to extract video ID
function extractVideoIdFromUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const PROXY_URL = process.env.PROXY_URL

// In-memory store for active downloads
interface DownloadRecord {
  url: string
  format: string
  title: string
  process: any
  status: "processing" | "completed" | "failed" | "cancelled"
  progress: number
  eta: number | null
  fileSize: number | null
  outputFile?: string
  originalFile?: string
  isAudioOnly?: boolean
  lastUpdated: number
  safeFilename?: string
  error?: string
  platform?: string
}

const activeDownloads = new Map<string, DownloadRecord>()

// Configure ffmpeg/ffprobe if custom paths are provided
if (config.ytdl.ffmpegPath) {
  ffmpeg.setFfmpegPath(config.ytdl.ffmpegPath)
  console.log(`Using custom FFmpeg path: ${config.ytdl.ffmpegPath}`)
}
if (config.ytdl.ffprobePath) {
  ffmpeg.setFfprobePath(config.ytdl.ffprobePath)
  console.log(`Using custom FFprobe path: ${config.ytdl.ffprobePath}`)
}

export class DownloadManager extends EventEmitter {
  private tempDir: string
  private cookiesDir: string
  private ytDlpPath: string
  private debug = true
  private cookiesPath: string | null = null

  constructor() {
    super()
    this.tempDir = config.ytdl.tempDir || path.join(os.tmpdir(), "youtube-downloader", "temp")
    this.cookiesDir = path.join(os.tmpdir(), "youtube-downloader", "cookies")
    this.ytDlpPath = config.ytdl.ytDlpPath || "ytdlp"

    // Ensure temp directory exists
    try {
      fs.mkdirSync(this.tempDir, { recursive: true })
      console.log(`Ensured temp directory exists: ${this.tempDir}`)

      // Also ensure cookies directory exists
      fs.mkdirSync(this.cookiesDir, { recursive: true })
      console.log(`Ensured cookies directory exists: ${this.cookiesDir}`)

      // Initialize cookies file
      this.initializeCookiesFile()
    } catch (err) {
      console.error(`Error creating directories:`, err)
    }

    // Relay progress events into store
    this.on("progress", (data) => {
      if (this.debug) {
        console.log(`Emitting progress event for ${data.taskId}: ${data.percentage}% at ${new Date().toISOString()}`)
      }

      // Update the active download record
      const download = activeDownloads.get(data.taskId)
      if (download) {
        download.progress = data.percentage
        download.eta = data.estimated
        download.fileSize = data.fileSize || download.fileSize
        download.status = data.status
        download.lastUpdated = Date.now()

        if (data.audioOnly !== undefined) {
          download.isAudioOnly = data.audioOnly
        }
      }

      // Update the global progress store
      updateProgress(
        data.taskId,
        data.percentage,
        data.estimated,
        data.fileSize,
        data.format,
        data.status,
        data.audioOnly,
      )
    })

    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupCompletedDownloads()
    }, config.ytdl.cleanupInterval || 300000) // Default: 5 minutes

    // Refresh cookies periodically
    setInterval(() => {
      try {
        this.initializeCookiesFile()
        console.log("Cookies refreshed from disk")
      } catch (err) {
        console.error("Failed to refresh cookies:", err)
      }
    }, 3600000) // Refresh cookies every hour
  }

  /**
   * Get platform-specific cookies file
   */
  private getPlatformCookiesFile(platform: string): string {
    const cookiesFiles = {
      youtube: "youtube.com_cookies.txt",
      facebook: "facebook.com_cookies.txt",
      instagram: "instagram.com_cookies.txt",
      tiktok: "tiktok.com_cookies.txt",
      snapchat: "snapchat.com_cookies.txt",
    }

    const filename = cookiesFiles[platform as keyof typeof cookiesFiles] || "youtube.com_cookies.txt"
    return path.join(this.cookiesDir, filename)
  }

  /**
   * Initialize cookies file from disk
   */
  private initializeCookiesFile(platform = "youtube"): string {
    const cookiesPath = this.getPlatformCookiesFile(platform)

    // If platform-specific cookies don't exist, fall back to YouTube cookies
    if (!fs.existsSync(cookiesPath) && platform !== "youtube") {
      const fallbackPath = this.getPlatformCookiesFile("youtube")
      if (fs.existsSync(fallbackPath)) {
        console.log(`Using YouTube cookies as fallback for ${platform}`)
        this.cookiesPath = fallbackPath
        return fallbackPath
      }
    }

    if (!fs.existsSync(cookiesPath)) {
      throw new Error(`Cookie file not found on disk: ${cookiesPath}`)
    }

    this.cookiesPath = cookiesPath
    console.log(`Loaded ${platform} cookies from disk: ${cookiesPath}`)
    return cookiesPath
  }

  public getDownload(taskId: string) {
    return activeDownloads.get(taskId)
  }

  /**
   * Fetch video title using yt-dlp with platform-specific handling
   */
  async getVideoInfo(
    url: string,
  ): Promise<{ title: string; thumbnail?: string; duration?: number; uploader?: string; view_count?: number }> {
    // Rate limiting: random delay between 1-3 seconds
    await sleep(1000 + Math.random() * 2000)

    const platform = detectPlatform(url) || "youtube"
    console.log(`Getting video info for ${platform}: ${url}`)

    // Initialize platform-specific cookies
    try {
      await this.initializeCookiesFile(platform)
    } catch (err) {
      console.warn(`Could not load ${platform} cookies, using YouTube cookies as fallback`)
      await this.initializeCookiesFile("youtube")
    }

    return new Promise((resolve, reject) => {
      // Build platform-specific arguments
      const args = [
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        "--user-agent",
        pickUA(),
        "--cookies",
        this.cookiesPath!,
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
        "5",
        "--socket-timeout",
        "30",
        "--sleep-requests",
        "1",
        "--sleep-interval",
        "1",
        "--max-sleep-interval",
        "5",
        "--ignore-errors",
      ]

      // Platform-specific configurations
      if (platform === "youtube" && INVIDIOUS) {
        args.unshift("--extractor-args", `youtube:base_url=${pickInvidiousBase()}`)
      }

      if (platform === "facebook") {
        args.push("--add-header", "Sec-Fetch-Dest:document")
        args.push("--add-header", "Cache-Control:max-age=0")
      }

      // Inject proxy if defined
      if (PROXY_URL) {
        args.push("--proxy", PROXY_URL)
      }

      args.push(url)

      console.log(`Getting video info with args: ${args.join(" ")}`)

      const cp = spawn(this.ytDlpPath, args)
      let out = ""
      let err = ""

      cp.stdout.on("data", (d) => (out += d.toString()))
      cp.stderr.on("data", (d) => {
        err += d.toString()
        console.log(`yt-dlp stderr: ${d.toString()}`)
      })

      cp.on("close", async (code) => {
        if (err.includes("This video is DRM protected")) {
          console.error(`DRM-protected URL, skipping info for ${url}`);
          reject(new Error("This video is DRM-protected and cannot be downloaded."));
          return;
        }
        if (code === 0 && out.trim()) {

          try {
            const info = JSON.parse(out.trim())
            resolve({
              title: info.title,
              thumbnail: info.thumbnail,
              duration: info.duration,
              uploader: info.uploader,
              view_count: info.view_count || 0,
            })
          } catch (error) {
            console.error("Error parsing yt-dlp output:", error)

            // If we can't parse the JSON but have a title, return that
            const titleMatch = out.match(/"title":\s*"([^"]+)"/)
            if (titleMatch && titleMatch[1]) {
              resolve({ title: titleMatch[1] })
              return
            }

            // Try alternative fallback methods
            try {
              const fallbackInfo = await fallbackWithAlternativeMethod(url, "info-fallback")
              resolve(fallbackInfo)
            } catch (fallbackError) {
              reject(new Error("Failed to parse video information"))
            }
          }
        } else {
          console.error(`yt-dlp exited with code ${code}: ${err}`)

          // Check for specific error conditions
          if (err.includes("Video unavailable") || err.includes("This video is not available")) {
            reject(new Error("Video is not available or has been removed"))
            return
          }

          // Unsupported URL or authentication required
          if (err.includes("Unsupported URL") || err.includes("Sign in to confirm") || err.includes("HTTP Error 403")) {
            console.log(`[${platform}] Primary extraction failed, using advanced fallbacks...`)

            try {
              const fallbackInfo = await fallbackWithAlternativeMethod(url, platform)
              resolve(fallbackInfo)
              return
            } catch (fallbackError) {
              console.error(`All fallback methods failed for ${platform}:`, fallbackError)
            }

            // Final basic fallback
            resolve({
              title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
              thumbnail:
                platform === "youtube"
                  ? `https://img.youtube.com/vi/${this.extractVideoId(url)}/hqdefault.jpg`
                  : undefined,
              uploader: "Unknown",
              duration: 0,
              view_count: 0,
            })
            return
          }

          reject(new Error(`yt-dlp exited with code ${code}: ${err}`))
        }
      })

      cp.on("error", (error) => {
        console.error(`yt-dlp process error:`, error)
        reject(error)
      })
    })
  }

  /**
   * Start the download and conversion process with enhanced platform support
   */
  public async startDownload(url: string, format: string, title: string, taskId?: string): Promise<string> {
    await sleep(1000 + Math.random() * 2000)

    const downloadTaskId = taskId || uuidv4().slice(0, 8)
    const isMP3 = format.startsWith("mp3")
    const platform = detectPlatform(url) || "youtube"

    console.log(`Starting download for task ${downloadTaskId}: ${url} (${format}) - Platform: ${platform}`)

    const safeTitle = title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
      .slice(0, 50)

    activeDownloads.set(downloadTaskId, {
      url,
      format,
      title,
      platform,
      process: null,
      status: "processing",
      progress: 0,
      eta: null,
      fileSize: null,
      lastUpdated: Date.now(),
      safeFilename: `${safeTitle}_${downloadTaskId}.${isMP3 ? "mp3" : "mp4"}`,
    })

    this.emit("progress", {
      taskId: downloadTaskId,
      percentage: 0,
      estimated: 60,
      fileSize: null,
      format,
      status: "processing",
    })

    // Initialize platform-specific cookies
    try {
      await this.initializeCookiesFile(platform)
    } catch (err) {
      console.warn(`Could not load ${platform} cookies, using YouTube cookies as fallback`)
      await this.initializeCookiesFile("youtube")
    }

    const tempBase = path.join(this.tempDir, `${safeTitle}_${downloadTaskId}`)

    const args = [
      "--newline",
      "--progress",
      "--user-agent",
      pickUA(),
      "--no-playlist",
      "--no-warnings",
      "--verbose",
      "--cookies",
      this.cookiesPath!,
      "--add-header",
      "Accept-Language:en-US,en;q=0.9",
      "--add-header",
      "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
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
      "5",
      "--socket-timeout",
      "30",
      "--sleep-requests",
      "1",
      "--sleep-interval",
      "1",
      "--max-sleep-interval",
      "5",
      "--ignore-errors",
    ]

    // Platform-specific configurations
    if (platform === "youtube" && INVIDIOUS) {
      args.unshift("--extractor-args", `youtube:base_url=${INVIDIOUS}`)
    }

    if (platform === "facebook") {
      args.push("--add-header", "Sec-Fetch-Dest:document")
      args.push("--add-header", "Cache-Control:max-age=0")
    }

    if (PROXY_URL) {
      args.push("--proxy", PROXY_URL)
    }

    // Enhanced format selection based on platform and request
    if (isMP3) {
      // For platforms that don't have separate audio streams, download video first then convert
      if (platform === "tiktok" || platform === "snapchat") {
        args.push("--format", "best", "--output", `${tempBase}.%(ext)s`)
      } else {
        // For platforms with separate audio streams
        args.push(
          "--format",
          "bestaudio",
          "--extract-audio",
          "--audio-format",
          "mp3",
          "--output",
          `${tempBase}.%(ext)s`,
        )
      }
    } else {
      let formatString: string
      switch (format) {
        case "mp4_720":
          formatString = "bestvideo[height<=720]+bestaudio/best[height<=720]"
          break
        case "mp4_1080":
          formatString = "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
          break
        case "mp4_best":
        default:
          formatString = "bestvideo+bestaudio/best"
          break
      }

      args.push("--format", formatString, "--merge-output-format", "mp4", "--output", `${tempBase}.%(ext)s`)
    }

    args.push(url)
    console.log(`[${downloadTaskId}] yt-dlp args:`, args)

    const cp = spawn(this.ytDlpPath, args)
    activeDownloads.get(downloadTaskId)!.process = cp

    let buf = ""
    cp.stdout.on("data", (d) => {
      buf += d.toString()
      const lines = buf.split("\n")
      buf = lines.pop() || ""
      lines.forEach((l) => this.parseYtDlpProgress(l, downloadTaskId, format))
    })

    cp.stderr.on("data", (d) => {
      const msg = d.toString()
      console.error(`yt-dlp stderr: ${msg}`)
      if (msg.includes("Sign in to confirm you're not a bot")) {
        console.log(`[${downloadTaskId}] Bot detected, refreshing cookies`)
        try {
          this.initializeCookiesFile(platform)
        } catch (e) {
          console.error(e)
        }
      }
    })

    const finalize = () => {
      try {
        const files = fs.readdirSync(this.tempDir).filter((f) => f.startsWith(`${safeTitle}_${downloadTaskId}`))
        if (!files.length) return this.fail(downloadTaskId, "no output files")

        const rec = activeDownloads.get(downloadTaskId)!
        rec.safeFilename = `${safeTitle}_${downloadTaskId}.${isMP3 ? "mp3" : "mp4"}`

        if (!isMP3) {
          const mp4 = files.find((f) => f.endsWith(".mp4"))
          if (mp4) {
            const inp = path.join(this.tempDir, mp4)
            const out = path.join(this.tempDir, `${safeTitle}_${downloadTaskId}.mp4`)
            rec.originalFile = inp
            rec.safeFilename = path.basename(out)
            return this.finalizeDownload(downloadTaskId, inp, out, false)
          }
          const alt = files.find((f) => /\.(webm|mkv|avi|mov)$/.test(f))
          if (alt) return this.startConversion(downloadTaskId, path.join(this.tempDir, alt), false)
        } else {
          // For MP3 requests
          if (platform === "tiktok" || platform === "snapchat") {
            // These platforms downloaded video, need to convert to MP3
            const videoFile = files.find((f) => /\.(mp4|webm|mkv|avi|mov)$/.test(f))
            if (videoFile) {
              const inp = path.join(this.tempDir, videoFile)
              rec.originalFile = inp
              rec.safeFilename = `${safeTitle}_${downloadTaskId}.mp3`
              return this.startConversion(downloadTaskId, inp, true)
            }
          } else {
            // Other platforms should have audio files
            const af = files.find((f) => /\.(m4a|opus|webm|mp3)$/.test(f))
            if (af) {
              const inp = path.join(this.tempDir, af)
              rec.originalFile = inp
              rec.safeFilename = `${safeTitle}_${downloadTaskId}.mp3`
              return this.startConversion(downloadTaskId, inp, true)
            }
          }
        }
        this.fail(downloadTaskId, "could not locate output")
      } catch (e) {
        console.error(e)
        this.fail(downloadTaskId, "finalization error")
      }
    }

    cp.on("close", async (code) => {
      console.log(`[${downloadTaskId}] yt-dlp exited with code ${code}`)

      if (code !== 0) {
        try {
          console.log(`[${downloadTaskId}] Falling back to alternative extraction…`)
          const fbInfo = await fallbackWithAlternativeMethod(url, downloadTaskId)

          // Check if we got stream URLs from fallback
          if ("streamUrls" in fbInfo && Array.isArray(fbInfo.streamUrls) && fbInfo.streamUrls.length > 0) {
            // Try to download from the first available stream URL
            const streamUrl = fbInfo.streamUrls[0]
            console.log(`[${downloadTaskId}] Trying direct download from: ${streamUrl}`)

            const fbArgs = [
              "--newline",
              "--progress",
              "--user-agent",
              pickUA(),
              "--add-header",
              "Referer:" + url,
              "--add-header",
              "Origin:" + new URL(url).origin,
              "--format",
              isMP3 ? (platform === "tiktok" || platform === "snapchat" ? "best" : "bestaudio") : "best",
              ...(isMP3 && platform !== "tiktok" && platform !== "snapchat"
                ? ["--extract-audio", "--audio-format", "mp3"]
                : isMP3
                  ? []
                  : ["--merge-output-format", "mp4"]),
              "--output",
              `${tempBase}.%(ext)s`,
              streamUrl,
            ]

            console.log(`[${downloadTaskId}] Fallback yt-dlp args:`, fbArgs)

            const fbProc = spawn(this.ytDlpPath, fbArgs)
            activeDownloads.get(downloadTaskId)!.process = fbProc

            let fbBuf = ""
            fbProc.stdout.on("data", (data) => {
              fbBuf += data.toString()
              const lines = fbBuf.split("\n")
              fbBuf = lines.pop() || ""
              for (const line of lines) {
                this.parseYtDlpProgress(line, downloadTaskId, format)
              }
            })

            fbProc.stderr.on("data", (data) => console.error(data.toString()))

            fbProc.on("close", (exitCode) => {
              if (exitCode === 0) {
                finalize()
              } else {
                this.fail(downloadTaskId, `fallback yt-dlp exited ${exitCode}`)
              }
            })

            return // Wait for fallback process
          } else {
            throw new Error("No downloadable stream URLs found")
          }
        } catch (err) {
          console.error(`[${downloadTaskId}] all fallback methods failed:`, err)
          updateProgress(
            downloadTaskId,
            0,   // percentage
            0,   // eta
            null, // fileSize
            format,
            "failed"
          );

          this.fail(downloadTaskId, "all methods failed")
        }
        return
      }

      // Primary download succeeded
      finalize()
    })

    cp.on("error", (err) => {
      console.error(`[${downloadTaskId}] spawn error:`, err)
      this.fail(downloadTaskId, `spawn error: ${err.message}`)
    })

    return downloadTaskId
  }

  /**
   * Finalize download by renaming or copying the file
   */
  private finalizeDownload(taskId: string, inputFile: string, outputFile: string, isAudioOnly: boolean) {
    const download = activeDownloads.get(taskId)
    if (!download) return

    console.log(`Finalizing download for ${taskId}: ${inputFile} -> ${outputFile}`)

    try {
      if (inputFile !== outputFile) {
        fs.copyFileSync(inputFile, outputFile)
        console.log(`File copied: ${inputFile} -> ${outputFile}`)
        try {
          fs.unlinkSync(inputFile)
          console.log(`Original file deleted: ${inputFile}`)
        } catch (err) {
          console.error(`Error deleting original file ${inputFile}:`, err)
        }
      }

      download.outputFile = outputFile
      download.safeFilename = path.basename(outputFile)
      download.status = "completed"
      download.progress = 100
      download.lastUpdated = Date.now()

      this.emit("progress", {
        taskId,
        percentage: 100,
        estimated: 0,
        fileSize: download.fileSize,
        format: download.format,
        status: "completed",
        audioOnly: isAudioOnly,
      })

      console.log(`Download finalized for ${taskId}`)
    } catch (error) {
      console.error(`Error finalizing download for ${taskId}:`, error)

      if (download.originalFile && fs.existsSync(download.originalFile)) {
        download.outputFile = download.originalFile
        download.status = "completed"
        download.progress = 100
        download.lastUpdated = Date.now()

        this.emit("progress", {
          taskId,
          percentage: 100,
          estimated: 0,
          fileSize: download.fileSize,
          format: download.format,
          status: "completed",
          audioOnly: isAudioOnly,
        })

        console.log(`Using original file as fallback for ${taskId}: ${download.originalFile}`)
      } else {
        this.fail(taskId, `Failed to finalize download: ${error}`)
      }
    }
  }

  /**
   * Parse yt-dlp progress output and update progress
   */
  private parseYtDlpProgress(line: string, taskId: string, format: string) {
    const download = activeDownloads.get(taskId)
    if (!download) return

    // Look for download progress lines
    const progressMatch =
      /\[download\]\s+(\d+\.\d+)%\s+of\s+~?\s*(\d+\.\d+)(K|M|G)iB\s+at\s+(\d+\.\d+)(K|M|G)iB\/s\s+ETA\s+(\d+):(\d+)/.exec(
        line,
      )

    if (progressMatch) {
      const percentage = Number.parseFloat(progressMatch[1])
      const size = Number.parseFloat(progressMatch[2])
      const sizeUnit = progressMatch[3]
      const etaMinutes = Number.parseInt(progressMatch[6], 10)
      const etaSeconds = Number.parseInt(progressMatch[7], 10)

      // Convert size to bytes
      let fileSizeBytes = size
      if (sizeUnit === "K") fileSizeBytes *= 1024
      else if (sizeUnit === "M") fileSizeBytes *= 1024 * 1024
      else if (sizeUnit === "G") fileSizeBytes *= 1024 * 1024 * 1024

      // Calculate total ETA in seconds
      const etaTotalSeconds = etaMinutes * 60 + etaSeconds

      // Update download record - scale to 0-50% for download phase
      const scaledPercentage = percentage / 2
      download.progress = scaledPercentage
      download.eta = etaTotalSeconds
      download.fileSize = fileSizeBytes
      download.lastUpdated = Date.now()

      // Emit progress event
      this.emit("progress", {
        taskId,
        percentage: scaledPercentage,
        estimated: etaTotalSeconds,
        fileSize: fileSizeBytes,
        format,
        status: "processing",
      })

      console.log(
        `Download progress for ${taskId}: ${percentage}%, ETA: ${etaMinutes}m${etaSeconds}s (scaled: ${scaledPercentage}%)`,
      )
    }

    // Also check for other progress indicators
    if (line.includes("[download]") && !progressMatch) {
      console.log(`Download progress line (unmatched): ${line}`)

      // Try to extract percentage with a simpler regex
      const simplePercentMatch = /(\d+(?:\.\d+)?)%/.exec(line)
      if (simplePercentMatch) {
        const percentage = Number.parseFloat(simplePercentMatch[1])
        const scaledPercentage = percentage / 2

        download.progress = scaledPercentage
        download.lastUpdated = Date.now()

        this.emit("progress", {
          taskId,
          percentage: scaledPercentage,
          estimated: download.eta,
          fileSize: download.fileSize,
          format: download.format,
          status: "processing",
        })

        console.log(`Simple progress match: ${percentage}% (scaled: ${scaledPercentage}%)`)
      }
    }

    // Check for download completion
    if (line.includes("[download] 100%")) {
      download.progress = 50 // Set to 50% as we still need to process with FFmpeg
      download.lastUpdated = Date.now()

      this.emit("progress", {
        taskId,
        percentage: 50,
        estimated: 30, // Estimate 30 seconds for conversion
        fileSize: download.fileSize,
        format,
        status: "processing",
      })

      console.log(`Download completed for ${taskId}, starting conversion`)
    }
  }

  /**
   * Run FFmpeg on the downloaded file
   */
  private startConversion(taskId: string, inputFile: string, isAudioOnly: boolean) {
    const download = activeDownloads.get(taskId)
    if (!download) return

    console.log(`Starting conversion for ${taskId} from ${inputFile}`)

    // Verify input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Input file does not exist: ${inputFile}`)
      this.fail(taskId, `Conversion failed: Input file not found`)
      return
    }

    // Store the original file path as fallback
    download.originalFile = inputFile

    // Update audio-only status if needed
    if (isAudioOnly && !download.format.includes("mp3")) {
      download.isAudioOnly = true
      download.lastUpdated = Date.now()
      console.log(`Detected audio-only file for MP4 request: ${inputFile}`)

      // Emit an event to inform the client
      this.emit("progress", {
        taskId,
        percentage: download.progress,
        estimated: download.eta,
        fileSize: download.fileSize,
        format: download.format,
        status: "processing",
        audioOnly: true,
      })
    }

    // Create a safe filename from the title
    const safeTitle = download.title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()

    // Use temp directory for output
    const outputFile = path.join(
      this.tempDir,
      `${safeTitle}_${taskId}.${download.format.includes("mp3") ? "mp3" : "mp4"}`,
    )

    // Store the output file path in the download record
    download.outputFile = outputFile
    download.lastUpdated = Date.now()

    console.log(`FFmpeg conversion: ${inputFile} -> ${outputFile}`)

    try {
      const ffmpegCommand = ffmpeg(inputFile)

      // Configure based on format
      if (download.format.includes("mp3")) {
        // For MP3, convert to MP3 format with appropriate bitrate
        const bitrate = download.format.includes("320") ? 320 : download.format.includes("256") ? 256 : 128

        ffmpegCommand
          .audioCodec("libmp3lame")
          .audioBitrate(bitrate)
          .format("mp3")
          .outputOptions(["-y", "-preset", "ultrafast"])
      } else if (isAudioOnly) {
        // For audio-only files requested as MP4, convert to MP4 container
        ffmpegCommand.audioCodec("aac").audioBitrate(192).format("mp4").outputOptions(["-y", "-preset", "ultrafast"])
      } else {
        // For MP4, just copy the streams to avoid re-encoding
        ffmpegCommand.outputOptions(["-c", "copy", "-y"])
      }

      ffmpegCommand
        .output(outputFile)
        .on("start", (cmd) => {
          console.log(`FFmpeg started with command: ${cmd}`)

          // Update progress to show we're in the conversion phase
          this.emit("progress", {
            taskId,
            percentage: 60,
            estimated: 20,
            fileSize: download.fileSize,
            format: download.format,
            status: "processing",
          })
        })
        .on("progress", (progress) => {
          // FFmpeg progress is from 0-100
          const percentage = Math.floor(progress.percent || 0)

          // Scale progress from 50-100% (as download was 0-50%)
          const scaledPercentage = 50 + percentage / 2

          download.progress = scaledPercentage
          download.lastUpdated = Date.now()

          this.emit("progress", {
            taskId,
            percentage: scaledPercentage,
            estimated: null,
            fileSize: download.fileSize,
            format: download.format,
            status: "processing",
          })

          console.log(`FFmpeg progress for ${taskId}: ${percentage}% (scaled: ${scaledPercentage}%)`)
        })
        .on("end", () => {
          console.log(`FFmpeg finished for ${taskId}`)

          // Update status to completed
          download.status = "completed"
          download.progress = 100
          download.lastUpdated = Date.now()

          this.emit("progress", {
            taskId,
            percentage: 100,
            estimated: 0,
            fileSize: download.fileSize,
            format: download.format,
            status: "completed",
            audioOnly: download.isAudioOnly,
          })

          // Clean up input file if it's different from output
          if (inputFile !== outputFile) {
            try {
              fs.unlinkSync(inputFile)
              console.log(`Temporary file deleted: ${inputFile}`)
            } catch (err) {
              console.error(`Error deleting temp file ${inputFile}:`, err)
            }
          }
        })
        .on("error", (err) => {
          console.error(`FFmpeg error for ${taskId}:`, err)

          // If conversion fails, use the original file as fallback
          console.log(`Using original file as fallback for ${taskId}: ${download.originalFile}`)

          if (download.originalFile && fs.existsSync(download.originalFile)) {
            download.outputFile = download.originalFile
            download.status = "completed"
            download.progress = 100
            download.lastUpdated = Date.now()

            this.emit("progress", {
              taskId,
              percentage: 100,
              estimated: 0,
              fileSize: download.fileSize,
              format: download.format,
              status: "completed",
              audioOnly: isAudioOnly,
            })
          } else {
            this.fail(taskId, `Conversion error: ${err.message}`)
          }
        })
        .run()
    } catch (error) {
      console.error(`Error starting FFmpeg for ${taskId}:`, error)

      // If FFmpeg fails to start, use the original file as fallback
      if (download.originalFile && fs.existsSync(download.originalFile)) {
        download.outputFile = download.originalFile
        download.status = "completed"
        download.progress = 100
        download.lastUpdated = Date.now()

        this.emit("progress", {
          taskId,
          percentage: 100,
          estimated: 0,
          fileSize: download.fileSize,
          format: download.format,
          status: "completed",
          audioOnly: isAudioOnly,
        })

        console.log(`Using original file as fallback for ${taskId}: ${download.originalFile}`)
      } else {
        this.fail(taskId, `Failed to start conversion: ${error}`)
      }
    }
  }

  /**
   * Cancel an active download
   */
  public cancelDownload(taskId: string): boolean {
    console.log(`Attempting to cancel download ${taskId}`)

    const download = activeDownloads.get(taskId)
    if (!download) {
      console.log(`Download ${taskId} not found for cancellation`)
      return false
    }

    // Kill the process if it exists
    if (download.process && typeof download.process.kill === "function") {
      try {
        download.process.kill("SIGTERM")
        console.log(`Process for ${taskId} terminated`)
      } catch (err) {
        console.error(`Error killing process for ${taskId}:`, err)
      }
    }

    // Update status
    download.status = "cancelled"
    download.lastUpdated = Date.now()

    // Emit progress event with cancelled status
    this.emit("progress", {
      taskId,
      percentage: download.progress,
      estimated: 0,
      fileSize: download.fileSize,
      format: download.format,
      status: "cancelled",
    })

    // Clean up any files
    if (download.outputFile && fs.existsSync(download.outputFile)) {
      try {
        fs.unlinkSync(download.outputFile)
      } catch (err) {
        console.error(`Error deleting output file ${download.outputFile}:`, err)
      }
    }

    if (download.originalFile && fs.existsSync(download.originalFile)) {
      try {
        fs.unlinkSync(download.originalFile)
      } catch (err) {
        console.error(`Error deleting original file ${download.originalFile}:`, err)
      }
    }

    console.log(`Download ${taskId} marked as cancelled`)
    return true
  }

  /**
   * Mark a download as failed
   */
  private fail(taskId: string, message: string) {
    console.error(`Download ${taskId} failed: ${message}`)

    const download = activeDownloads.get(taskId)
    if (!download) return

    download.status = "failed"
    download.error = message
    download.lastUpdated = Date.now()

    this.emit("progress", {
      taskId,
      percentage: download.progress,
      estimated: 0,
      fileSize: download.fileSize,
      format: download.format,
      status: "failed",
    })
  }

  /**
   * Clean up completed downloads after a certain time
   */
  public cleanupCompletedDownloads() {
    const maxAge = config.ytdl.maxFileAge || 600000 // Default: 10 minutes
    const now = Date.now()

    console.log(`Running cleanup for completed downloads older than ${maxAge / 60000} minutes`)

    // Clean up files in the temp directory
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir)

        for (const file of files) {
          const filePath = path.join(this.tempDir, file)

          try {
            const stats = fs.statSync(filePath)
            const fileAge = now - stats.mtimeMs

            if (fileAge > maxAge) {
              fs.unlinkSync(filePath)
              console.log(`Cleaned up old file: ${filePath} (age: ${fileAge / 60000} minutes)`)
            }
          } catch (err) {
            console.error(`Error checking/deleting file ${filePath}:`, err)
          }
        }
      }
    } catch (err) {
      console.error(`Error cleaning up temp directory:`, err)
    }

    // Clean up completed downloads from memory
    for (const [taskId, download] of activeDownloads.entries()) {
      const downloadAge = now - download.lastUpdated

      if (
        (download.status === "completed" || download.status === "failed" || download.status === "cancelled") &&
        downloadAge > maxAge
      ) {
        // Remove from active downloads
        activeDownloads.delete(taskId)
        console.log(
          `Removed old download record for ${taskId} (status: ${download.status}, age: ${downloadAge / 60000} minutes)`,
        )
      }
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  private extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
}

export const downloadManager = new DownloadManager()

// Set up periodic cleanup
setInterval(() => {
  downloadManager.cleanupCompletedDownloads()
}, config.ytdl.cleanupInterval || 300000) // Default: 5 minutes
