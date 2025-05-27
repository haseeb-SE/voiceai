import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const isWin = process.platform === "win32";
const isProd = process.env.NODE_ENV === "production";
const BIN_DIR = path.join(process.cwd(), "bin");

// Read proxy URL from env
const proxyUrl = process.env.PROXY_URL || null;

function resolveBinary(name: string): string {
  const binName = isWin ? `${name}.exe` : name;
  const localPath = path.join(BIN_DIR, binName);
  if (fs.existsSync(localPath)) return localPath;
  if (isProd) {
    for (const dir of ["/usr/bin", "/usr/local/bin", "/app/bin", "/bin"]) {
      const full = path.join(dir, binName);
      if (fs.existsSync(full)) return full;
    }
  }
  return binName;
}

function ensureTempDirExists() {
  const tempDir = path.join(os.tmpdir(), "youtube-downloader", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

export const config = {
  ytdl: {
    ytDlpPath: resolveBinary("yt-dlp"),
    ffmpegPath: resolveBinary("ffmpeg"),
    ffprobePath: resolveBinary("ffprobe"),
    tempDir: ensureTempDirExists(),
    cleanupInterval: 300_000,
    maxFileAge: 600_000,
    proxyUrl,                // <-- newly added
  },
  redis: {
    enabled: !!process.env.REDIS_URL,
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
};