"use client"
import Link from "next/link"
import { Youtube, Facebook, Instagram } from "lucide-react"
import { FaTiktok, FaSnapchat } from "react-icons/fa"

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
    icon: FaTiktok,
    color: "bg-teal-600",
    hoverColor: "hover:bg-teal-700",
    borderColor: "border-teal-500",
    path: "/tiktok",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: FaSnapchat,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    borderColor: "border-yellow-500",
    path: "/snapchat",
  },
]

export function PlatformSelector() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-3">
      {platforms.map((platform) => {
        const Icon = platform.icon
        return (
          <Link href={platform.path} key={platform.id} className="block">
            <div
              className={`
                flex items-center gap-2 p-2
                ${platform.color}
                ${platform.hoverColor}
                border ${platform.borderColor}
                rounded-lg text-white
                hover:scale-105 transition-transform duration-300
                cursor-pointer
              `}
            >
              <Icon className="h-6 w-6" />
              <span className="font-medium">{platform.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
