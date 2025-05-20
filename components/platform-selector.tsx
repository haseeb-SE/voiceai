"use client"
import Link from "next/link"
import { Youtube, Facebook, Instagram, Twitter, SnailIcon as Snapchat } from "lucide-react"

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    borderColor: "border-red-500",
    path: "/youtube",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    borderColor: "border-blue-500",
    path: "/facebook",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-pink-600",
    hoverColor: "hover:bg-pink-700",
    borderColor: "border-pink-500",
    path: "/instagram",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Twitter, // Using Twitter icon as a placeholder for TikTok
    color: "bg-teal-600",
    hoverColor: "hover:bg-teal-700",
    borderColor: "border-teal-500",
    path: "/tiktok",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: Snapchat,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    borderColor: "border-yellow-500",
    path: "/snapchat",
  },
]

export function PlatformSelector() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {platforms.map((platform) => (
        <Link href={platform.path} key={platform.id} className="block">
          <div
            className={`flex items-center gap-2 p-3 ${platform.color} rounded-lg text-white hover:scale-105 transition-transform duration-300 cursor-pointer`}
          >
            <platform.icon className="h-5 w-5" />
            <span className="font-medium">{platform.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
