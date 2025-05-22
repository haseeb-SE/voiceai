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

console.log("Downloading FFmpeg and FFprobe...")

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

// Function to download and extract FFmpeg based on platform
async function downloadFFmpeg() {
  let ffmpegUrl
  let ffmpegPath
  let ffprobePath

  if (isWindows) {
    // For Windows, download the static builds
    ffmpegUrl = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
    ffmpegPath = path.join(binDir, "ffmpeg.exe")
    ffprobePath = path.join(binDir, "ffprobe.exe")

    const zipPath = path.join(binDir, "ffmpeg.zip")

    try {
      console.log(`Downloading FFmpeg from ${ffmpegUrl}`)
      await downloadFile(ffmpegUrl, zipPath)

      console.log("Extracting FFmpeg...")
      // Use PowerShell to extract the zip file
      const extractCommand = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${binDir}' -Force"`

      exec(extractCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error extracting FFmpeg: ${error.message}`)
          return
        }

        console.log("FFmpeg extracted, finding executables...")

        // Find the ffmpeg.exe and ffprobe.exe files in the extracted directory
        const findExecutables = (dir) => {
          const results = []
          const files = fs.readdirSync(dir)

          for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
              results.push(...findExecutables(filePath))
            } else if (file === "ffmpeg.exe" || file === "ffprobe.exe") {
              results.push(filePath)
            }
          }

          return results
        }

        const executables = findExecutables(binDir)
        console.log("Found executables:", executables)

        // Copy the executables to the bin directory
        for (const executable of executables) {
          const fileName = path.basename(executable)
          const destPath = path.join(binDir, fileName)

          fs.copyFileSync(executable, destPath)
          console.log(`Copied ${fileName} to ${destPath}`)
        }

        // Update the .env.local file
        updateEnvFile(ffmpegPath, ffprobePath)

        // Clean up the zip file
        fs.unlinkSync(zipPath)
      })
    } catch (error) {
      console.error("Error downloading FFmpeg:", error)
    }
  } else if (isMac) {
    // For Mac, use homebrew if available, otherwise download static builds
    exec("which brew", (error, stdout) => {
      if (!error && stdout.trim()) {
        console.log("Homebrew found, installing FFmpeg...")
        exec("brew install ffmpeg", (brewError, brewStdout, brewStderr) => {
          if (brewError) {
            console.error(`Error installing FFmpeg with Homebrew: ${brewError.message}`)
            return
          }

          // Find the installed ffmpeg and ffprobe paths
          exec("which ffmpeg", (ffmpegError, ffmpegStdout) => {
            if (!ffmpegError && ffmpegStdout.trim()) {
              ffmpegPath = ffmpegStdout.trim()

              exec("which ffprobe", (ffprobeError, ffprobeStdout) => {
                if (!ffprobeError && ffprobeStdout.trim()) {
                  ffprobePath = ffprobeStdout.trim()
                  updateEnvFile(ffmpegPath, ffprobePath)
                }
              })
            }
          })
        })
      } else {
        // Download static builds
        const ffmpegUrl = "https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip"
        const ffprobeUrl = "https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip"

        ffmpegPath = path.join(binDir, "ffmpeg")
        ffprobePath = path.join(binDir, "ffprobe")

        const ffmpegZipPath = path.join(binDir, "ffmpeg.zip")
        const ffprobeZipPath = path.join(binDir, "ffprobe.zip")

        Promise.all([downloadFile(ffmpegUrl, ffmpegZipPath), downloadFile(ffprobeUrl, ffprobeZipPath)])
          .then(() => {
            // Extract the zip files
            exec(`unzip -o ${ffmpegZipPath} -d ${binDir} && chmod +x ${ffmpegPath}`, (ffmpegError) => {
              if (ffmpegError) {
                console.error(`Error extracting FFmpeg: ${ffmpegError.message}`)
              }

              exec(`unzip -o ${ffprobeZipPath} -d ${binDir} && chmod +x ${ffprobePath}`, (ffprobeError) => {
                if (ffprobeError) {
                  console.error(`Error extracting FFprobe: ${ffprobeError.message}`)
                }

                updateEnvFile(ffmpegPath, ffprobePath)

                // Clean up zip files
                fs.unlinkSync(ffmpegZipPath)
                fs.unlinkSync(ffprobeZipPath)
              })
            })
          })
          .catch((error) => {
            console.error("Error downloading FFmpeg:", error)
          })
      }
    })
  } else if (isLinux) {
    // For Linux, try to use apt-get if available, otherwise download static builds
    exec("which apt-get", (error, stdout) => {
      if (!error && stdout.trim()) {
        console.log("apt-get found, installing FFmpeg...")
        exec("apt-get update && apt-get install -y ffmpeg", (aptError, aptStdout, aptStderr) => {
          if (aptError) {
            console.error(`Error installing FFmpeg with apt-get: ${aptError.message}`)
            return
          }

          // Find the installed ffmpeg and ffprobe paths
          exec("which ffmpeg", (ffmpegError, ffmpegStdout) => {
            if (!ffmpegError && ffmpegStdout.trim()) {
              ffmpegPath = ffmpegStdout.trim()

              exec("which ffprobe", (ffprobeError, ffprobeStdout) => {
                if (!ffprobeError && ffprobeStdout.trim()) {
                  ffprobePath = ffprobeStdout.trim()
                  updateEnvFile(ffmpegPath, ffprobePath)
                }
              })
            }
          })
        })
      } else {
        // Download static builds
        const ffmpegUrl = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
        const tarPath = path.join(binDir, "ffmpeg.tar.xz")

        ffmpegPath = path.join(binDir, "ffmpeg")
        ffprobePath = path.join(binDir, "ffprobe")

        downloadFile(ffmpegUrl, tarPath)
          .then(() => {
            // Extract the tar.xz file
            const extractDir = path.join(binDir, "ffmpeg-extract")
            if (!fs.existsSync(extractDir)) {
              fs.mkdirSync(extractDir, { recursive: true })
            }

            exec(`tar -xf ${tarPath} -C ${extractDir}`, (tarError) => {
              if (tarError) {
                console.error(`Error extracting FFmpeg: ${tarError.message}`)
                return
              }

              // Find the ffmpeg and ffprobe executables
              const findExecutables = (dir) => {
                const results = []
                const files = fs.readdirSync(dir)

                for (const file of files) {
                  const filePath = path.join(dir, file)
                  const stat = fs.statSync(filePath)

                  if (stat.isDirectory()) {
                    results.push(...findExecutables(filePath))
                  } else if (file === "ffmpeg" || file === "ffprobe") {
                    results.push(filePath)
                  }
                }

                return results
              }

              const executables = findExecutables(extractDir)
              console.log("Found executables:", executables)

              // Copy the executables to the bin directory
              for (const executable of executables) {
                const fileName = path.basename(executable)
                const destPath = path.join(binDir, fileName)

                fs.copyFileSync(executable, destPath)
                fs.chmodSync(destPath, 0o755) // Make executable
                console.log(`Copied ${fileName} to ${destPath}`)
              }

              updateEnvFile(ffmpegPath, ffprobePath)

              // Clean up
              fs.unlinkSync(tarPath)
              fs.rmSync(extractDir, { recursive: true, force: true })
            })
          })
          .catch((error) => {
            console.error("Error downloading FFmpeg:", error)
          })
      }
    })
  } else {
    console.error("Unsupported platform")
  }
}

// Update the .env.local file with FFmpeg and FFprobe paths
function updateEnvFile(ffmpegPath, ffprobePath) {
  const envPath = path.join(process.cwd(), ".env.local")
  const envContent = `FFMPEG_PATH=${ffmpegPath.replace(/\\/g, "\\\\")}\nFFPROBE_PATH=${ffprobePath.replace(/\\/g, "\\\\")}\n`

  // Append to existing .env.local or create new one
  if (fs.existsSync(envPath)) {
    const currentEnv = fs.readFileSync(envPath, "utf8")
    if (!currentEnv.includes("FFMPEG_PATH")) {
      fs.appendFileSync(envPath, envContent)
    } else {
      // Update existing paths
      const updatedEnv = currentEnv
        .replace(/FFMPEG_PATH=.*(\r?\n|$)/, `FFMPEG_PATH=${ffmpegPath.replace(/\\/g, "\\\\")}\n`)
        .replace(/FFPROBE_PATH=.*(\r?\n|$)/, `FFPROBE_PATH=${ffprobePath.replace(/\\/g, "\\\\")}\n`)
      fs.writeFileSync(envPath, updatedEnv)
    }
  } else {
    fs.writeFileSync(envPath, envContent)
  }

  console.log(".env.local updated with FFmpeg and FFprobe paths")
}

downloadFFmpeg()
