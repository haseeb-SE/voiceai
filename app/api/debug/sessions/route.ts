import { downloadManager } from "@/lib/download-manager"

export async function GET() {
  try {
    const stats = downloadManager.getStats()
    const sessions = Array.from(downloadManager.getSessions().entries()).map(([id, session]) => ({
      id,
      status: session.status,
      title: session.title,
      outputFile: session.outputFile,
      hasFile: session.outputFile ? require("fs").existsSync(session.outputFile) : false,
    }))

    return Response.json({
      success: true,
      stats,
      sessions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting debug info:", error)
    return Response.json(
      {
        error: "Failed to get debug info",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
