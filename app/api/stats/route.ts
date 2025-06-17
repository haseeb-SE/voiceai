import { downloadManager } from "@/lib/download-manager"

export async function GET() {
  try {
    const stats = downloadManager.getStats()

    return Response.json({
      success: true,
      stats: {
        ...stats,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    return Response.json(
      {
        error: "Failed to get stats",
      },
      { status: 500 },
    )
  }
}
