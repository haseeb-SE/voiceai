import type { NextRequest } from "next/server";
import { downloadManager } from "@/lib/download-manager";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

// CRITICAL FIX: Enhanced request tracking with session locking
const activeDownloads = new Map<string, boolean>();
const downloadLocks = new Map<string, Promise<Response>>();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionid: string }> | { sessionid: string } },
) {
  let sessionId: string | undefined;

  try {
    console.log("[DOWNLOAD] Request URL:", request.url);

    // Handle both promise and direct params for compatibility
    if (context.params && typeof context.params === "object") {
      if ("then" in context.params) {
        const params = await context.params;
        sessionId = params.sessionid;
      } else {
        sessionId = (context.params as { sessionid: string }).sessionid;
      }
    } else {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split("/");
      sessionId = pathSegments[pathSegments.length - 1].split("?")[0]; // Remove query params
    }

    if (!sessionId || sessionId === "undefined" || sessionId === "null") {
      console.error("[DOWNLOAD] Session ID is missing or invalid:", sessionId);
      return new Response("Session ID required", { status: 400 });
    }

    console.log(`[DOWNLOAD] Processing download request for session ${sessionId}`);

    // CRITICAL FIX: Aggressive concurrency prevention
    const range = request.headers.get("range");
    const isRangeRequest = !!range;

    const download = downloadManager.getDownload(sessionId);
    // Ensure `isMP3` accurately reflects audio-only downloads regardless of explicit 'mp3' format string
    const isMP3 = download?.format?.includes("mp3") || download?.isAudioOnly === true;

    // BLOCK ALL RANGE REQUESTS for MP3 files to prevent browser interference
    if (isMP3 && isRangeRequest) {
      console.log(`[DOWNLOAD] BLOCKING range request for MP3 file ${sessionId}: ${range}`);
      return new Response("Range requests not supported for MP3 files", {
        status: 416, // Range Not Satisfiable
        headers: {
          "Accept-Ranges": "none", // Explicitly state no range support
          "Content-Type": "text/plain",
        },
      });
    }

    // CRITICAL: Check if there's already a download in progress for this session
    if (downloadLocks.has(sessionId)) {
      console.log(`[DOWNLOAD] Download already in progress for ${sessionId}, waiting...`);
      return await downloadLocks.get(sessionId)!;
    }

    // CRITICAL: Create a download promise to prevent concurrent requests
    const downloadPromise = handleDownload(sessionId, request, isMP3); // Pass isMP3 to handler
    downloadLocks.set(sessionId, downloadPromise);

    try {
      const response = await downloadPromise;
      return response;
    } finally {
      // Clean up the lock after completion
      downloadLocks.delete(sessionId);
    }
  } catch (error) {
    console.error("[DOWNLOAD] Critical error:", error);
    if (sessionId) {
      downloadLocks.delete(sessionId);
      activeDownloads.delete(sessionId);
    }
    return new Response(`Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    });
  }
}

/**
 * Handles the actual file download, streaming the content to the client.
 * @param sessionId The ID of the download session.
 * @param request The NextRequest object.
 * @param isMP3 A boolean indicating if the file is an MP3.
 * @returns A Promise that resolves to a Response object.
 */
async function handleDownload(sessionId: string, request: NextRequest, isMP3: boolean): Promise<Response> {
  let stream: fs.ReadStream | null = null;
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;

  try {
    const download = downloadManager.getDownload(sessionId);
    if (!download) {
      console.error(`[DOWNLOAD] Download session ${sessionId} not found`);
      return new Response("Download not found", { status: 404 });
    }

    console.log(`[DOWNLOAD] Found session ${sessionId} with status: ${download.status}`);
    if (download.status !== "completed") {
      console.error(`[DOWNLOAD] Download ${sessionId} not completed (status: ${download.status})`);
      return new Response(`Download not completed (status: ${download.status})`, { status: 400 });
    }
    if (!download.outputFile) {
      console.error(`[DOWNLOAD] No output file for session ${sessionId}`);
      return new Response("Output file not found", { status: 404 });
    }

    console.log(`[DOWNLOAD] File type detected: ${isMP3 ? "MP3" : "MP4"}`);

    const filePath = download.outputFile;
    let finalFilePath: string | null = null;
    let fileStats: fs.Stats | null = null;

    try {
      fileStats = fs.statSync(filePath);
      finalFilePath = filePath;
    } catch (statError: any) {
      // If the direct path doesn't exist, try resolving via `path.join` with `/tmp`
      const tmpFilePath = path.join("/tmp", path.basename(filePath));
      try {
        fileStats = fs.statSync(tmpFilePath);
        finalFilePath = tmpFilePath;
      } catch (tmpStatError: any) {
        console.error(`[DOWNLOAD] File not found at ${filePath} or ${tmpFilePath}:`, tmpStatError);
        return new Response("File not found on server", { status: 404 });
      }
    }

    if (!finalFilePath || !fileStats) {
      return new Response("File not found on server", { status: 404 });
    }

    const fileName = path.basename(finalFilePath);
    // Set proper MIME type for MP3 to ensure browser handles it correctly
    const mimeType = isMP3 ? "audio/mpeg" : "video/mp4";

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range, Cache-Control, Pragma, Accept",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Range, Accept-Ranges, Content-Type, Content-Disposition, X-File-Size",
      "X-File-Size": fileStats.size.toString(),
      "X-Download-Method": "streaming",
    };

    // Set Accept-Ranges header based on file type
    if (isMP3) {
      headers["Accept-Ranges"] = "none"; // MP3s explicitly do not support range requests
    } else {
      headers["Accept-Ranges"] = "bytes"; // MP4s do support range requests
    }

    // Add Content-Transfer-Encoding for MP3s for extra browser guidance (often not strictly needed but harmless)
    if (isMP3) {
      headers["Content-Transfer-Encoding"] = "binary";
    }

    const range = request.headers.get("range");

    // Handle range requests only for MP4 files. For MP3s, the check in GET() will block them.
    if (range && !isMP3) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStats.size - 1;
      const chunkSize = end - start + 1;

      // Validate range
      if (start >= fileStats.size || end >= fileStats.size || start < 0 || end < 0 || start > end) {
        console.error(`[DOWNLOAD] Invalid range request for ${sessionId}: ${range}`);
        return new Response("Range Not Satisfiable", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileStats.size}`,
            "Content-Type": "text/plain",
          },
        });
      }

      stream = fs.createReadStream(finalFilePath, { start, end });

      headers["Content-Range"] = `bytes ${start}-${end}/${fileStats.size}`;
      headers["Content-Length"] = chunkSize.toString();

      const webStream = new ReadableStream({
        start(c) {
          controller = c;
          stream!.on("data", (chunk) => {
            controller!.enqueue(new Uint8Array(chunk));
          });
          stream!.on("end", () => {
            controller!.close();
            console.log(`[DOWNLOAD] MP4 partial streaming response complete for ${sessionId} - ${chunkSize} bytes`);
          });
          stream!.on("error", (err) => {
            console.error(`[DOWNLOAD] Stream error for ${sessionId}:`, err);
            controller!.error(err);
          });
        },
        cancel() {
          console.log(`[DOWNLOAD] Stream cancelled by client for ${sessionId}`);
          if (stream && !stream.destroyed) {
            stream.destroy();
          }
        },
      });

      console.log(`[DOWNLOAD] MP4 partial streaming response - ${chunkSize} bytes (range: ${range})`);
      return new Response(webStream, { headers, status: 206 }); // Return 206 for partial content
    } else {
      // Full file download (for MP3s or non-range MP4 requests)
      stream = fs.createReadStream(finalFilePath);

      const webStream = new ReadableStream({
        start(c) {
          controller = c;
          stream!.on("data", (chunk) => {
            controller!.enqueue(new Uint8Array(chunk));
          });
          stream!.on("end", () => {
            controller!.close();
            console.log(`[DOWNLOAD] Full streaming response complete for ${sessionId} - ${fileStats!.size} bytes`);
          });
          stream!.on("error", (err) => {
            console.error(`[DOWNLOAD] Stream error for ${sessionId}:`, err);
            controller!.error(err);
          });
        },
        cancel() {
          console.log(`[DOWNLOAD] Stream cancelled by client for ${sessionId}`);
          if (stream && !stream.destroyed) {
            stream.destroy();
          }
        },
      });

      headers["Content-Length"] = fileStats.size.toString();

      console.log(`[DOWNLOAD] Full streaming response - ${fileStats.size} bytes`);
      return new Response(webStream, { headers, status: 200 }); // Return 200 for full content
    }
  } catch (error) {
    console.error(`[DOWNLOAD] Error in handleDownload for ${sessionId}:`, error);

    // Cleanup on error
    if (stream && !stream.destroyed) {
      stream.destroy();
    }
    // Ensure activeDownloads is cleared on error for the current session
    activeDownloads.delete(sessionId);

    throw error;
  }
}

// Enhanced OPTIONS handler
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range, Cache-Control, Pragma, Accept",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    },
  });
}
