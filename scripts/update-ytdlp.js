const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const os = require("os")
const https = require("https")

const isWindows = os.platform() === "win32"
const isMac = os.platform() === "darwin"
const isLinux = os.platform() === "linux"

const binDir = path.join(process.cwd(), "bin")

// Create bin directory if it doesn't exist
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true })
}

console.log("Updating yt-dlp to the latest version...")

// Function to download a file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        response.pipe(file)
        file.on("finish", () => {
          file.close(resolve)
          console.log(`Downloaded ${url} to ${dest}`)
        })
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {}) // Delete the file on error
        reject(err)
      })
  })
}

// Function to download yt-dlp based on platform
async function updateYtDlp() {
  let ytDlpUrl
  let ytDlpPath

  if (isWindows) {
    ytDlpPath = path.join(binDir, "yt-dlp.exe")
    ytDlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
  } else if (isMac || isLinux) {
    ytDlpPath = path.join(binDir, "yt-dlp")
    ytDlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
  } else {
    console.error("Unsupported platform")
    return
  }

  console.log(`Downloading latest yt-dlp to ${ytDlpPath}`)

  try {
    await downloadFile(ytDlpUrl, ytDlpPath)

    // Make the file executable on Mac/Linux
    if (isMac || isLinux) {
      fs.chmodSync(ytDlpPath, 0o755)
      console.log(`Made ${ytDlpPath} executable`)
    }

    // Create a .env.local file with the path to yt-dlp
    const envPath = path.join(process.cwd(), ".env.local")
    const envContent = `YT_DLP_PATH=${ytDlpPath.replace(/\\/g, "\\\\")}\n`

    // Append to existing .env.local or create new one
    if (fs.existsSync(envPath)) {
      const currentEnv = fs.readFileSync(envPath, "utf8")
      if (!currentEnv.includes("YT_DLP_PATH")) {
        fs.appendFileSync(envPath, envContent)
      } else {
        // Update existing YT_DLP_PATH
        const updatedEnv = currentEnv.replace(/YT_DLP_PATH=.*(\r?\n|$)/, envContent)
        fs.writeFileSync(envPath, updatedEnv)
      }
    } else {
      fs.writeFileSync(envPath, envContent)
    }

    console.log(".env.local updated with YT_DLP_PATH")

    // Test the downloaded yt-dlp
    exec(`"${ytDlpPath}" --version`, (testError, testStdout, testStderr) => {
      if (testError) {
        console.error(`Error testing yt-dlp: ${testError.message}`)
        return
      }
      console.log(`yt-dlp version: ${testStdout.trim()}`)
    })
  } catch (error) {
    console.error("Error downloading yt-dlp:", error)
  }
}

updateYtDlp()
