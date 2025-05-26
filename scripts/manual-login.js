const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const readline = require("readline");
const os = require("os");
const { convertJsonCookiesToNetscape } = require("../lib/cookie-converter");

const CHROME_PATH = "/usr/bin/google-chrome"; // Adjust if needed

async function waitForEnter() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question("", () => {
            rl.close();
            resolve();
        });
    });
}

async function saveLoginCookies() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: CHROME_PATH,
        defaultViewport: null,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let page = await browser.newPage();
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

    console.log("⚠️ Please log in manually to YouTube.");
    console.log("✅ Press Enter once you've finished logging in.\n");

    await waitForEnter();

    try {
        // Grab all open pages in case login redirects to a new one
        const pages = await browser.pages();
        const activePage = pages[pages.length - 1]; // get most recently opened tab
        const cookies = await activePage.cookies();
        const expiry = cookies.map(c => `${c.name} expires in ${Math.round(((c.expires || 0) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days`);
        console.log("🔁 Cookie expiry:", expiry.join(", "));
        const netscapeCookies = convertJsonCookiesToNetscape(JSON.stringify(cookies));
        const cookieDir = path.join(os.tmpdir(), "youtube-downloader", "cookies");
        const cookiePath = path.join(cookieDir, "youtube.com_cookies.txt");

        fs.mkdirSync(cookieDir, { recursive: true });
        fs.writeFileSync(cookiePath, netscapeCookies);

        console.log(`✅ Cookies saved to: ${cookiePath}`);
    } catch (err) {
        console.error("❌ Error fetching cookies:", err.message);
    } finally {
        await browser.close();
    }
}

saveLoginCookies();
