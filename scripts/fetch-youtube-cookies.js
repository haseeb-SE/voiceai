// scripts/fetch-youtube-cookies.js
const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const { convertJsonCookiesToNetscape } = require("../lib/cookie-converter")

async function refreshCookies() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Load cookies from saved session
  const cookiesPath = path.join(__dirname, "../cookies/cookies.json")
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"))
    await page.setCookie(...cookies)
    console.log("🔁 Loaded saved cookies")
  }

  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })
  console.log("🌐 Visited YouTube")

  const cookies = await page.cookies()
  await browser.close()

  const netscapeCookies = convertJsonCookiesToNetscape(JSON.stringify(cookies))

  const outputDir = path.join(require("os").tmpdir(), "youtube-downloader", "cookies")
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, "youtube.com_cookies.txt"), netscapeCookies)

  console.log(`✅ Updated yt-dlp cookies at ${outputDir}/youtube.com_cookies.txt`)
}

refreshCookies()
