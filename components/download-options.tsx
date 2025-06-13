"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Download, Music, Video } from "lucide-react"
import { getPlatformButtonColor } from "@/lib/platform-detector"

interface DownloadOptionsProps {
  type: "audio" | "video"
  onTypeChange: (type: "audio" | "video") => void
  onDownload: (format: string) => void
  platform: string | null
}

export function DownloadOptions({
  type,
  onTypeChange,
  onDownload,
  platform,
}: DownloadOptionsProps) {
  const audioFormats = [
    {
      id: "mp3_320",
      name: "MP3 320kbps",
      quality: "High Quality",
      icon: Music,
      description: "Best audio quality",
    },
    {
      id: "mp3_256",
      name: "MP3 256kbps",
      quality: "Medium Quality",
      icon: Music,
      description: "Good balance of quality and size",
    },
    {
      id: "mp3_128",
      name: "MP3 128kbps",
      quality: "Standard Quality",
      icon: Music,
      description: "Smaller file size",
    },
  ]

  const videoFormats = [
    {
      id: "mp4_best",
      name: "MP4 Best Quality",
      quality: "Best Available",
      icon: Video,
      description: "Highest resolution available",
    },
    {
      id: "mp4_1080",
      name: "MP4 1080p",
      quality: "Full HD",
      icon: Video,
      description: "1920×1080 resolution",
    },
    {
      id: "mp4_720",
      name: "MP4 720p",
      quality: "HD",
      icon: Video,
      description: "1280×720 resolution",
    },
  ]

  const formats = type === "audio" ? audioFormats : videoFormats
  // fallback red if your platform detector doesn’t provide one
  const downloadBtnColor = getPlatformButtonColor(platform) || "bg-red-600 "

  return (
    <div className="space-y-6">
      {/* ——— Audio / Video Tabs ——— */}
      <Tabs value={type} onValueChange={onTypeChange}>

        <TabsContent value={type}>
          {/* ——— Formats Table ——— */}
          <Table className="border-gray-700">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Format</TableHead>
                <TableHead className="text-gray-300">Quality</TableHead>
                <TableHead className="hidden md:table-cell text-gray-300">
                  Description
                </TableHead>
                <TableHead className="text-right text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formats.map((fmt) => (
                <TableRow key={fmt.id} className="border-gray-700">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <fmt.icon className="h-4 w-4 text-gray-400" />
                      <span>{fmt.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{fmt.quality}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-400">
                    {fmt.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => onDownload(fmt.id)}
                      className={`${downloadBtnColor} text-white`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
