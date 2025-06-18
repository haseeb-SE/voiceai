// lib/video-cache.ts
import fs from "fs";
import path from "path";
import { downloadQueue } from "./download-queue";

/**
 * A single cache slot for one (videoId, format).
 */
export interface CacheSlot {
    ready: boolean;
    filePath: string;
}

/**
 * One entry per videoId, mapping every requested format to its slot.
 */
export interface CacheEntry {
    videoId: string;
    formats: Record<string, CacheSlot>;
}

/**
 * In‐memory index: videoId → CacheEntry
 * (You can swap this out for a real DB if you like.)
 */
export const cacheIndex = new Map<string, CacheEntry>();

/**
 * Where we store all static precoded files.
 */
export const STATIC_CACHE_DIR = path.join(process.cwd(), "static_cache");

// Ensure the cache directory exists on startup
if (!fs.existsSync(STATIC_CACHE_DIR)) {
    fs.mkdirSync(STATIC_CACHE_DIR, { recursive: true });
}

/**
 * Determine file extension from format string.
 */
function extForFormat(format: string): string {
    return format.startsWith("mp3") ? "mp3" : "mp4";
}

/**
 * Ensure that (videoId, format) is scheduled for precaching.
 *
 * @param videoId  The YouTube video ID
 * @param format   e.g. "mp4_720", "mp4_1080", "mp4_best", "mp3_320", etc.
 * @param url      The original watch URL ("https://youtube.com/watch?v=…")
 * @param title    A human-readable title (used only for metadata)
 * @returns        The CacheSlot (with .filePath), whose `.ready` will flip to true
 *                once your download-manager finishes it.
 */
export function ensureCache(
    videoId: string,
    format: string,
    url: string,
    title: string
): CacheSlot {
    // Get or create the entry
    let entry = cacheIndex.get(videoId);
    if (!entry) {
        entry = { videoId, formats: {} };
        cacheIndex.set(videoId, entry);
    }

    // Get or create the slot for this format
    let slot = entry.formats[format];
    if (!slot) {
        const ext = extForFormat(format);
        const fileName = `${videoId}_${format}.${ext}`;
        const filePath = path.join(STATIC_CACHE_DIR, fileName);

        slot = { ready: false, filePath };
        entry.formats[format] = slot;

        // Enqueue a background precache job at lowest priority (0)
        downloadQueue.addToQueue(
            `cache-${videoId}-${format}`, // a unique ID we can parse later
            url,
            format,
            title,
      /* priority = */ 0
        );
    }

    return slot;
}

/**
 * After your download-manager finishes a `cache-…` task, call this
 * to flip the slot to `.ready = true`.
 *
 * @param taskId  The taskId like "cache-<videoId>-<format>"
 */
export function markCacheReady(taskId: string) {
    const parts = taskId.split("-");
    if (parts[0] !== "cache" || parts.length < 3) return;

    // pieces: ["cache", "<videoId...potentially-with-dashes>", "<format>"]
    const format = parts.pop()!;
    const videoId = parts.slice(1).join("-");

    const entry = cacheIndex.get(videoId);
    if (!entry) return;

    const slot = entry.formats[format];
    if (slot) slot.ready = true;
}
