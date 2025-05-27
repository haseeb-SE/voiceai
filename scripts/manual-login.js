// scripts/manual-login.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const pptr = require("puppeteer-extra");                    // ← use puppeteer-extra
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { convertJsonCookiesToNetscape } = require("../lib/cookie-converter");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

pptr.use(StealthPlugin());                                   // ← enable stealth

async function waitForEnter() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("", () => { rl.close(); resolve(); });
  });
}

async function saveLoginCookies() {
  const browser = await pptr.launch({
    headless: false,
    executablePath: CHROME_PATH,
    userDataDir: path.join(os.homedir(), ".config", "puppeteer", "yt-profile"), 
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

  console.log("⚠️ Please log in manually to YouTube.");
  console.log("✅ Press Enter once you've finished logging in.\n");
  await waitForEnter();

  try {
    const pages = await browser.pages();
    const activePage = pages[pages.length - 1];
    const cookies = await activePage.cookies();
    const netscape = convertJsonCookiesToNetscape(JSON.stringify(cookies));

    const cookieDir = path.join(os.tmpdir(), "youtube-downloader", "cookies");
    fs.mkdirSync(cookieDir, { recursive: true });
    fs.writeFileSync(path.join(cookieDir, "youtube.com_cookies.txt"), netscape);

    console.log(`✅ Cookies saved to: ${path.join(cookieDir, "youtube.com_cookies.txt")}`);
  } catch (err) {
    console.error("❌ Error fetching cookies:", err);
  } finally {
    await browser.close();
  }
}

saveLoginCookies();



