import { type NextRequest, NextResponse } from "next/server"
import { downloadManager } from "@/lib/download-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    console.log(`[STATUS-API] Checking status for task: ${taskId}`)

    const session = downloadManager.getSession(taskId)
    if (!session) {
      console.log(`[STATUS-API] Session ${taskId} not found`)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const statusData = {
      taskId,
      status: session.status,
      percentage: session.progress,
      eta: session.eta,
      fileSize: session.fileSize,
      format: session.format,
      audioOnly: session.isAudioOnly,
      speed: session.speed,
      phase: session.phase,
      error: session.error,
      timestamp: Date.now(),
    }

    console.log(`[STATUS-API] Status for ${taskId}:`, statusData)

    return NextResponse.json(statusData)
  } catch (error) {
    console.error("[STATUS-API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
