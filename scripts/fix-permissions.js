const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const os = require("os")

const isWindows = os.platform() === "win32"
const isMac = os.platform() === "darwin"
const isLinux = os.platform() === "linux"

// Get the bin directory
const binDir = path.join(process.cwd(), "bin")

console.log("Checking and fixing executable permissions...")

// Create bin directory if it doesn't exist
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true })
  console.log(`Created bin directory at ${binDir}`)
}

// Function to fix permissions on a file
function fixPermissions(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`)
    return
  }

  console.log(`Fixing permissions for: ${filePath}`)

  if (isWindows) {
    // On Windows, we don't need to change permissions
    console.log("Windows detected, no permission changes needed")
  } else {
    // On Mac/Linux, make the file executable
    try {
      fs.chmodSync(filePath, 0o755)
      console.log(`Made ${filePath} executable`)
    } catch (error) {
      console.error(`Error making ${filePath} executable:`, error)
    }
  }
}

// Check for yt-dlp executable
const ytDlpPath = isWindows ? path.join(binDir, "yt-dlp.exe") : path.join(binDir, "yt-dlp")

// Check for ffmpeg executable
const ffmpegPath = isWindows ? path.join(binDir, "ffmpeg.exe") : path.join(binDir, "ffmpeg")

// Check for ffprobe executable
const ffprobePath = isWindows ? path.join(binDir, "ffprobe.exe") : path.join(binDir, "ffprobe")

// Fix permissions for all executables
fixPermissions(ytDlpPath)
fixPermissions(ffmpegPath)
fixPermissions(ffprobePath)

console.log("Permission check complete")

// Test yt-dlp if it exists
if (fs.existsSync(ytDlpPath)) {
  console.log("Testing yt-dlp...")

  const command = isWindows ? `"${ytDlpPath}" --version` : `"${ytDlpPath}" --version`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error testing yt-dlp: ${error.message}`)
      return
    }

    console.log(`yt-dlp version: ${stdout.trim()}`)
  })
}
