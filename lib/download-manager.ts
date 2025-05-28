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

// Puppeteer stealth fallback - dynamically imported to avoid Next.js compilation issues
async function fallbackWithPuppeteerStealth(url: string, taskId: string) {
  console.log(`[${taskId}] Attempting Puppeteer stealth fallback for ${url}`)

  try {
    // Dynamic import to avoid Next.js static analysis issues
    const puppeteer = await import("puppeteer-extra")
    const StealthPlugin = await import("puppeteer-extra-plugin-stealth")

    // Configure puppeteer with stealth plugin
    puppeteer.default.use(StealthPlugin.default())

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    })

    const [page] = await browser.pages()

    // Set a realistic user agent and viewport
    await page.setUserAgent(pickUA())
    await page.setViewport({ width: 1920, height: 1080 })

    // Set additional headers to mimic real browser
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    })

    // Navigate to the video page
    const targetUrl = INVIDIOUS || url
    console.log(`[${taskId}] Navigating to: ${targetUrl}`)

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    })

    // Wait a bit to let the page fully load
    await sleep(3000)

    // Try to extract video information and stream URLs
    const videoInfo = await page.evaluate(() => {
      // Try multiple methods to get video info
      const title =
        document.querySelector("title")?.textContent ||
        document.querySelector("h1")?.textContent ||
        document.querySelector("[data-title]")?.getAttribute("data-title") ||
        "Unknown Video"

      // Look for video player config
      let playerConfig = null
      const streamUrls: string[] = []

      try {
        // Try to access YouTube player config
        playerConfig = (window as any).ytplayer?.config?.args
        if (playerConfig) {
          // Extract stream URLs from player config
          const streamMap = playerConfig.url_encoded_fmt_stream_map || playerConfig.adaptive_fmts
          if (streamMap) {
            streamUrls.push(streamMap)
          }
        }
      } catch (e) {
        console.log("Could not access ytplayer config")
      }

      // Try to find video elements and their sources
      const videoElements = document.querySelectorAll("video")
      videoElements.forEach((video) => {
        if (video.src) streamUrls.push(video.src)
        const sources = video.querySelectorAll("source")
        sources.forEach((source) => {
          if (source.src) streamUrls.push(source.src)
        })
      })

      // Look for manifest URLs in the page
      const scripts = document.querySelectorAll("script")
      scripts.forEach((script) => {
        const content = script.textContent || ""
        const manifestMatch = content.match(/["']([^"']*\.m3u8[^"']*)["']/g)
        if (manifestMatch) {
          manifestMatch.forEach((match) => {
            const url = match.replace(/["']/g, "")
            if (url.includes("manifest") || url.includes("m3u8")) {
              streamUrls.push(url)
            }
          })
        }
      })

      return {
        title: title.replace(" - YouTube", "").trim(),
        playerConfig: playerConfig,
        streamUrls: streamUrls.filter((url) => url && url.length > 10), // Filter out empty/invalid URLs
        pageUrl: window.location.href,
      }
    })

    await browser.close()

    console.log(`[${taskId}] Puppeteer extracted:`, {
      title: videoInfo.title,
      streamCount: videoInfo.streamUrls.length,
    })

    // If we found stream URLs, we could potentially use them with yt-dlp
    if (videoInfo.streamUrls.length > 0) {
      console.log(`[${taskId}] Found ${videoInfo.streamUrls.length} potential stream URLs`)
      // For now, just return the video info - in a full implementation,
      // you could try to download directly from these URLs
    }

    return {
      title: videoInfo.title || `YouTube Video`,
      thumbnail: `https://img.youtube.com/vi/${extractVideoIdFromUrl(url)}/hqdefault.jpg`,
      uploader: "Unknown",
      duration: 0,
      view_count: 0,
      streamUrls: videoInfo.streamUrls, // Include stream URLs for potential direct download
    }
  } catch (error) {
    console.error(`[${taskId}] Puppeteer stealth fallback failed:`, error)
    throw error
  }
}

// Invidious API fallback
async function fallbackWithInvidiousAPI(url: string, taskId: string) {
  console.log(`[${taskId}] Attempting Invidious API fallback for ${url}`)

  try {
    if (!INVIDIOUS) {
      throw new Error("No Invidious instance configured")
    }

    const videoId = extractVideoIdFromUrl(url)
    if (!videoId) {
      throw new Error("Could not extract video ID")
    }

    const invidiousUrl = `${INVIDIOUS}/api/v1/videos/${videoId}`
    console.log(`[${taskId}] Trying Invidious API: ${invidiousUrl}`)

    const response = await fetch(invidiousUrl, {
      headers: {
        "User-Agent": pickUA(),
        Accept: "application/json",
      },
      timeout: 10000,
    })

    if (!response.ok) {
      throw new Error(`Invidious API returned ${response.status}`)
    }

    const data = await response.json()
    console.log(`[${taskId}] Successfully got video info from Invidious`)

    return {
      title: data.title || `Video ${videoId}`,
      thumbnail: data.videoThumbnails?.[0]?.url,
      duration: data.lengthSeconds,
      uploader: data.author,
      view_count: data.viewCount || 0,
    }
  } catch (error) {
    console.error(`[${taskId}] Invidious API fallback failed:`, error)
    throw error
  }
}

// Combined fallback method with multiple strategies
async function fallbackWithAlternativeMethod(url: string, taskId: string) {
  console.log(`[${taskId}] Attempting alternative fallback methods for ${url}`)

  // Strategy 1: Try Invidious API first (fastest)
  try {
    return await fallbackWithInvidiousAPI(url, taskId)
  } catch (error) {
    console.log(`[${taskId}] Invidious API failed, trying Puppeteer stealth...`)
  }

  // Strategy 2: Try Puppeteer stealth (more reliable but slower)
  try {
    return await fallbackWithPuppeteerStealth(url, taskId)
  } catch (error) {
    console.log(`[${taskId}] Puppeteer stealth failed, using basic fallback...`)
  }

  // Strategy 3: Basic fallback with video ID
  const videoId = extractVideoIdFromUrl(url)
  if (videoId) {
    return {
      title: `YouTube Video (${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      uploader: "Unknown",
      duration: 0,
      view_count: 0,
    }
  }

  throw new Error("All fallback methods failed")
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

    // Refresh cookies periodically (hourly reload from disk)
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
   * Initialize cookies file from disk
   */
  private initializeCookiesFile(): string {
    const cookiesPath = path.join(this.cookiesDir, "youtube.com_cookies.txt")
    if (!fs.existsSync(cookiesPath)) {
      throw new Error(`Cookie file not found on disk: ${cookiesPath}`)
    }
    this.cookiesPath = cookiesPath
    console.log(`Loaded cookies from disk: ${cookiesPath}`)
    return cookiesPath
  }

  public getDownload(taskId: string) {
    return activeDownloads.get(taskId)
  }

  /**
   * Fetch video title using yt-dlp with improved error handling and fallbacks
   */
  async getVideoInfo(
    url: string,
  ): Promise<{ title: string; thumbnail?: string; duration?: number; uploader?: string; view_count?: number }> {
    // Rate limiting: random delay between 1-3 seconds
    await sleep(1000 + Math.random() * 2000)

    // Ensure cookies file is initialized
    if (!this.cookiesPath) {
      await this.initializeCookiesFile()
    }

    return new Promise((resolve, reject) => {
      // Build arguments with cookies and user agent
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

      // Use Invidious as extractor base URL if available
      if (INVIDIOUS) {
        args.unshift("--extractor-args", `youtube:base_url=${INVIDIOUS}`)
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

          // Bot detection or 403 errors - trigger advanced fallbacks
          if (err.includes("Sign in to confirm you're not a bot") || err.includes("HTTP Error 403")) {
            const videoId = this.extractVideoId(url)

            if (videoId) {
              console.log(`[${videoId}] Bot detection triggered, using advanced fallbacks...`)

              try {
                // Use the comprehensive fallback method
                const fallbackInfo = await fallbackWithAlternativeMethod(url, videoId)
                resolve(fallbackInfo)
                return
              } catch (fallbackError) {
                console.error(`All fallback methods failed for ${videoId}:`, fallbackError)
              }

              // Final basic fallback
              resolve({
                title: `YouTube Video (${videoId})`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                uploader: "Unknown",
                duration: 0,
                view_count: 0,
              })
              return
            } else {
              console.error(`Couldn't parse video ID from ${url}`)
            }
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
   * Start the download and conversion process
   */
  async startDownload(url: string, format: string, title: string, taskId?: string): Promise<string> {
    // Rate limiting: random delay between 1-3 seconds
    await sleep(1000 + Math.random() * 2000)

    const downloadTaskId = taskId || uuidv4().slice(0, 8)
    const isMP3 = format.includes("mp3")

    console.log(`Starting download for task ${downloadTaskId}: ${url} (${format})`)

    // Create safe filename from title
    const safeTitle = title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
      .substring(0, 50) // Limit length

    activeDownloads.set(downloadTaskId, {
      url,
      format,
      title,
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

    try {
      if (!this.cookiesPath) {
        await this.initializeCookiesFile()
      }

      const tempBase = path.join(this.tempDir, `${safeTitle}_${downloadTaskId}`)

      const ytdlpArgs = [
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

      // Use Invidious as extractor base URL if available
      if (INVIDIOUS) {
        ytdlpArgs.unshift("--extractor-args", `youtube:base_url=${INVIDIOUS}`)
      }

      if (PROXY_URL) {
        ytdlpArgs.push("--proxy", PROXY_URL)
      }

      if (isMP3) {
        ytdlpArgs.push(
          "--format",
          "bestaudio[ext=m4a]/bestaudio",
          "--extract-audio",
          "--audio-format",
          "m4a",
          "--output",
          `${tempBase}.%(ext)s`,
        )
      } else {
        ytdlpArgs.push(
          "--format",
          "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio/bestvideo+bestaudio",
          "--merge-output-format",
          "mp4",
          "--output",
          `${tempBase}.%(ext)s`,
        )
      }

      ytdlpArgs.push(url)

      console.log(`Starting yt-dlp with args:`, ytdlpArgs)

      const ytdlpProcess = spawn(this.ytDlpPath, ytdlpArgs)
      activeDownloads.get(downloadTaskId)!.process = ytdlpProcess

      let stdoutBuffer = ""
      ytdlpProcess.stdout.on("data", (data) => {
        const text = data.toString()
        stdoutBuffer += text
        if (this.debug) console.log(`yt-dlp stdout: ${text}`)
        const lines = stdoutBuffer.split("\n")
        stdoutBuffer = lines.pop() || ""
        for (const line of lines) {
          this.parseYtDlpProgress(line, downloadTaskId, format)
        }
      })

      let stderrBuffer = ""
      ytdlpProcess.stderr.on("data", (data) => {
        stderrBuffer += data.toString()
        console.error(`yt-dlp stderr: ${data}`)
        if (data.toString().includes("Sign in to confirm you're not a bot")) {
          console.log("Bot detection triggered during download, refreshing cookies...")
          this.initializeCookiesFile().catch((err) => console.error("Failed to refresh cookies:", err))
        }
      })

      ytdlpProcess.on("close", async (code) => {
        console.log(`yt-dlp process exited with code ${code}`)

        if (code !== 0) {
          // If download failed due to bot detection, we could potentially
          // try using the stream URLs from Puppeteer fallback here
          this.fail(downloadTaskId, `Download failed with code ${code}`)
          return
        }

        const files = fs.readdirSync(this.tempDir)
        const downloadedFiles = files.filter((file) => file.startsWith(`${safeTitle}_${downloadTaskId}`))

        if (downloadedFiles.length === 0) {
          this.fail(downloadTaskId, "Download completed but no output files found")
          return
        }

        const download = activeDownloads.get(downloadTaskId)
        if (download) {
          download.safeFilename = `${safeTitle}_${downloadTaskId}.${isMP3 ? "mp3" : "mp4"}`
        }

        if (!isMP3) {
          const mp4File = downloadedFiles.find((f) => f.endsWith(".mp4"))
          if (mp4File) {
            const inputFile = path.join(this.tempDir, mp4File)
            const outputFile = path.join(this.tempDir, `${safeTitle}_${downloadTaskId}.mp4`)
            if (download) {
              download.originalFile = inputFile
              download.safeFilename = path.basename(outputFile)
            }
            this.finalizeDownload(downloadTaskId, inputFile, outputFile, false)
            return
          }

          const fallback = downloadedFiles.find((f) => /\.(webm|mkv|avi|mov)$/.test(f))
          if (fallback) {
            const inputFile = path.join(this.tempDir, fallback)
            this.startConversion(downloadTaskId, inputFile, false)
            return
          }
        } else {
          const audioFile = downloadedFiles.find((f) => /\.(m4a|webm|opus)$/.test(f))
          if (audioFile) {
            const inputFile = path.join(this.tempDir, audioFile)
            if (download) {
              download.originalFile = inputFile
              download.safeFilename = `${safeTitle}_${downloadTaskId}.mp3`
            }
            this.startConversion(downloadTaskId, inputFile, true)
            return
          }
        }

        this.fail(downloadTaskId, "Could not find appropriate output files")
      })

      ytdlpProcess.on("error", (err) => {
        console.error(`yt-dlp process error: ${err.message}`)
        this.fail(downloadTaskId, `Download process error: ${err.message}`)
      })

      return downloadTaskId
    } catch (error) {
      console.error(`Error starting download for task ${downloadTaskId}:`, error)
      this.fail(downloadTaskId, `Failed to start download: ${error}`)
      return downloadTaskId
    }
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

        // Use faster encoding preset for better performance
        ffmpegCommand
          .audioCodec("libmp3lame")
          .audioBitrate(bitrate)
          .format("mp3")
          .outputOptions(["-y", "-preset", "ultrafast"]) // Overwrite output file if it exists and use ultrafast preset
      } else if (isAudioOnly) {
        // For audio-only files requested as MP4, convert to MP4 container but it will be audio-only
        ffmpegCommand.audioCodec("aac").audioBitrate(192).format("mp4").outputOptions(["-y", "-preset", "ultrafast"]) // Overwrite output file if it exists and use ultrafast preset
      } else {
        // For MP4, just copy the streams to avoid re-encoding
        ffmpegCommand.outputOptions(["-c", "copy", "-y"]) // Copy streams and overwrite output
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
