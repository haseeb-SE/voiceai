// app/components/ShareButtons.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, MessageCircle, Share2 } from "lucide-react"

const shareUrl = "https://youtubetomp4download.com"

export function ShareButtons() {
  return (
    <div className="flex space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            "_blank"
          )
        }
        className="rounded-full border-gray-600 hover:bg-red-500 hover:border-red-500"
      >
        <Facebook className="h-5 w-5" />
        <span className="sr-only">Share on Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent("Convert YouTube to MP4 Instantly | Free YTMP4 Download")}`,
            "_blank"
          )
        }
        className="rounded-full border-gray-600 hover:bg-red-500 hover:border-red-500"
      >
        <Twitter className="h-5 w-5" />
        <span className="sr-only">Share on Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
              "Convert YouTube to MP4 Instantly | Free YTMP4 Download " + shareUrl
            )}`,
            "_blank"
          )
        }
        className="rounded-full border-gray-600 hover:bg-red-500 hover:border-red-500"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="sr-only">Share on WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          navigator.share
            ? navigator.share({
                title: "Dynamo Downloader",
                text: "Convert YouTube to MP4 Instantly | Free YTMP4 Download",
                url: shareUrl,
              })
            : alert("Sharing not supported in this browser")
        }
        className="rounded-full border-gray-600 hover:bg-red-500 hover:border-red-500"
      >
        <Share2 className="h-5 w-5" />
        <span className="sr-only">Native Share</span>
      </Button>
    </div>
  )
}
