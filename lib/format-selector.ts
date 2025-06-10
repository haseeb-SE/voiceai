/**
 * format-selector.ts
 *
 * A deterministic, multi-choice format picker.
 * ─────────────────────────────────────────────
 * • Always returns an **ordered array** of format strings.
 * • The caller tries them in sequence until yt-dlp accepts one.
 * • Guarantees at least one element (final catch-all "best").
 */

type FormatKey =
  | "mp4_best"
  | "mp4_1080"
  | "mp4_720"
  | "mp4_480"
  | "mp4_360"
  | "mp3_320"
  | "mp3_256"
  | "mp3_128";

/** First-class table keeps all logic in one place */
const FORMAT_TABLE: Record<FormatKey, string[]> = {
  // ── VIDEO ──────────────────────────────────────
  mp4_best: [
    "bv*+ba/b",                                   // any height with mux
    "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best", // explicit ext fallbacks
  ],
  mp4_1080: [
    "bv*[height<=1080]+ba/b",
    "best[height<=1080]",                          // single-file
  ],
  mp4_720: [
    "bv*[height<=720]+ba/b",
    "best[height<=720]",
  ],
  mp4_480: [
    "bv*[height<=480]+ba/b",
    "best[height<=480]",
  ],
  mp4_360: [
    "bv*[height<=360]+ba/b",
    "best[height<=360]",
  ],

  // ── AUDIO ─────────────────────────────────────
  mp3_320: ["bestaudio[abr>=256]/bestaudio/best"],
  mp3_256: ["bestaudio[abr>=192]/bestaudio/best"],
  mp3_128: ["bestaudio/best"],
};

/**
 * Returns a list of format strings to try (most-to-least preferred).
 * If the requested key is unknown, we still return ["best"].
 */
export function getFormatList(requested: string): string[] {
  if ((requested as FormatKey) in FORMAT_TABLE) {
    return [...FORMAT_TABLE[requested as FormatKey], "best"];
  }
  return ["best"];
}

/**
 * For code paths that still expect "a single string", keep a shim.
 * Takes the first choice.
 */
export function getPrimaryFormat(requested: string): string {
  return getFormatList(requested)[0];
}

/**
 * Last-chance fallback when all explicit strings error out.
 */
export const UNIVERSAL_FALLBACK = "best";
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
