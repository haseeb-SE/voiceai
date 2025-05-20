// Platform detection patterns
const PATTERNS = {
  youtube: [/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i, /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/.+/i],
  facebook: [
    /^(https?:\/\/)?(www\.|m\.|web\.)?(facebook|fb)\.com\/.+/i,
    /^(https?:\/\/)?(www\.|m\.|web\.)?fb\.watch\/.+/i,
  ],
  instagram: [
    /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(?:p|reel|tv)\/.+/i,
    /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/stories\/.+/i,
  ],
  tiktok: [/^(https?:\/\/)?(www\.|m\.|vm\.)?(tiktok\.com)\/.+/i],
  snapchat: [
    /^(https?:\/\/)?(www\.|m\.)?(snapchat\.com)\/.+/i,
    /^(https?:\/\/)?(www\.|m\.)?(story\.snapchat\.com)\/.+/i,
    /^(https?:\/\/)?(www\.|m\.)?(snapchat\.com\/spotlight)\/.+/i,
  ],
}

/**
 * Detects the platform from a given URL
 * @param url The URL to detect the platform from
 * @returns The detected platform or null if not detected
 */
export function detectPlatform(url: string): string | null {
  if (!url) return null

  // Check each platform's patterns
  for (const [platform, patterns] of Object.entries(PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return platform
      }
    }
  }

  return null
}

/**
 * Extracts the video ID from a URL based on the platform
 * @param url The URL to extract the ID from
 * @param platform The platform of the URL
 * @returns The extracted video ID or null if not found
 */
export function extractVideoId(url: string, platform: string): string | null {
  if (!url || !platform) return null

  switch (platform) {
    case "youtube": {
      // Handle YouTube URLs
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return match && match[2].length === 11 ? match[2] : null
    }
    case "facebook": {
      // Handle Facebook URLs
      // First try to match video IDs
      const videoRegExp =
        /facebook\.com\/(?:watch\/?\?v=|video\.php\?v=|video\.php\?id=|.*\/videos\/(?:vb\.\d+\/)?|.*\/videos\/\?ref=sharing&v=|.*\/video\/|watch\/\?v=)(\d+)/i
      const match = url.match(videoRegExp)

      if (match) return match[1]

      // If no video ID found, try to extract share ID
      const shareRegExp = /facebook\.com\/share\/([a-zA-Z0-9_-]+)/i
      const shareMatch = url.match(shareRegExp)

      if (shareMatch) return shareMatch[1]

      // If still no match, extract any alphanumeric ID from the URL
      const genericIdRegExp = /facebook\.com\/[^/]+\/([a-zA-Z0-9_-]{10,})/i
      const genericMatch = url.match(genericIdRegExp)

      return genericMatch ? genericMatch[1] : null
    }
    case "instagram": {
      // Handle Instagram URLs
      const regExp = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i
      const match = url.match(regExp)
      return match ? match[1] : null
    }
    case "tiktok": {
      // Handle TikTok URLs
      const regExp = /tiktok\.com\/(@[\w.-]+\/video\/|@[\w.-]+\/|v\/|embed\/v2\/)(\d+)/i
      const match = url.match(regExp)

      if (match) return match[2]

      // Alternative pattern for TikTok URLs without video ID in standard format
      const altRegExp = /tiktok\.com\/([^/]+)/i
      const altMatch = url.match(altRegExp)

      return altMatch ? altMatch[1] : null
    }
    case "snapchat": {
      // Handle Snapchat URLs
      // First try to match spotlight IDs
      const spotlightRegExp = /snapchat\.com\/spotlight\/([a-zA-Z0-9_-]+)/i
      const spotlightMatch = url.match(spotlightRegExp)

      if (spotlightMatch) return spotlightMatch[1]

      // Try to match story IDs
      const storyRegExp = /snapchat\.com\/(?:add|discover|stories)\/([a-zA-Z0-9_-]+)/i
      const storyMatch = url.match(storyRegExp)

      if (storyMatch) return storyMatch[1]

      // Try to match the complex Spotlight IDs
      const complexSpotlightRegExp = /snapchat\.com\/spotlight\/([a-zA-Z0-9_-]+)/i
      const complexMatch = url.match(complexSpotlightRegExp)

      if (complexMatch) return complexMatch[1]

      // If all else fails, extract any alphanumeric sequence that looks like an ID
      const genericIdRegExp = /snapchat\.com\/\w+\/([a-zA-Z0-9_-]{10,})/i
      const genericMatch = url.match(genericIdRegExp)

      if (genericMatch) return genericMatch[1]

      // Last resort: extract the entire path after spotlight/
      const lastResortRegExp = /snapchat\.com\/spotlight\/(.+?)(?:\?|$)/i
      const lastResortMatch = url.match(lastResortRegExp)

      return lastResortMatch ? lastResortMatch[1] : null
    }
    default:
      return null
  }
}

/**
 * Gets a platform-specific color
 * @param platform The platform name
 * @returns The color associated with the platform
 */
export function getPlatformColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "red"
    case "facebook":
      return "blue"
    case "instagram":
      return "pink"
    case "tiktok":
      return "teal"
    case "snapchat":
      return "yellow"
    default:
      return "gray"
  }
}

/**
 * Gets a platform-specific Tailwind border color class
 * @param platform The platform name
 * @returns The Tailwind border color class
 */
export function getPlatformBorderColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "border-red-500"
    case "facebook":
      return "border-blue-500"
    case "instagram":
      return "border-pink-500"
    case "tiktok":
      return "border-teal-500"
    case "snapchat":
      return "border-yellow-500"
    default:
      return "border-gray-500"
  }
}

/**
 * Gets a platform-specific Tailwind button color class
 * @param platform The platform name
 * @returns The Tailwind button color class
 */
export function getPlatformButtonColor(platform: string | null): string {
  switch (platform) {
    case "youtube":
      return "bg-red-600 hover:bg-red-700"
    case "facebook":
      return "bg-blue-600 hover:bg-blue-700"
    case "instagram":
      return "bg-pink-600 hover:bg-pink-700"
    case "tiktok":
      return "bg-teal-600 hover:bg-teal-700"
    case "snapchat":
      return "bg-yellow-500 hover:bg-yellow-600"
    default:
      return "bg-gray-600 hover:bg-gray-700"
  }
}
