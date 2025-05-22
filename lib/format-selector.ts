/**
 * Enhanced format selector with better quality options
 */

/**
 * Get the format string for yt-dlp based on the selected format
 * This is a more robust implementation that handles YouTube API changes better
 */
export function getFormatString(format: string): string {
  switch (format) {
    case "mp4_best":
      // Try multiple format combinations with fallbacks for best quality
      return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best"
    case "mp4_1024":
      // Full HD with good audio
      return "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best[height<=1080]"
    case "mp4_720":
      // HD with good audio
      return "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]"
    case "mp4_480":
      // SD with good audio
      return "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best[height<=480]"
    case "mp3_320":
      // High quality audio
      return "bestaudio[ext=m4a]/bestaudio"
    case "mp3_256":
      // Medium quality audio
      return "bestaudio[ext=m4a]/bestaudio"
    case "mp3_128":
      // Lower quality audio
      return "bestaudio[ext=m4a]/bestaudio"
    default:
      return "best" // Fallback to best available format
  }
}

/**
 * Get a simpler fallback format string when the primary format fails
 */
export function getFallbackFormatString(format: string): string {
  if (format.includes("mp3")) {
    return "bestaudio"
  }
  return "best"
}

/**
 * Get the format ID for a specific format
 * This is used when we need to list available formats first
 */
export function getFormatId(format: string, availableFormats: string[]): string {
  // If no formats available, return a generic format string
  if (!availableFormats || availableFormats.length === 0) {
    return getFallbackFormatString(format)
  }

  // Sort formats numerically (higher is usually better quality)
  const sortedFormats = [...availableFormats].sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  // For audio formats, prefer audio-only formats (usually lower numbers)
  if (format.includes("mp3")) {
    const audioFormats = availableFormats
      .filter((id) => Number.parseInt(id) < 100)
      .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

    if (audioFormats.length > 0) {
      return audioFormats[0]
    }
  }

  // For video formats, use the best available format
  return sortedFormats[0]
}
