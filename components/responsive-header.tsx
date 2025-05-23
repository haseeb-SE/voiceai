"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlatformSelector } from "@/components/platform-selector"
import { Youtube, Facebook, Instagram } from "lucide-react"
import { FaTiktok, FaSnapchat } from "react-icons/fa"

const platformConfig = {
  "/": {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    gradientFrom: "from-red-600",
    gradientTo: "to-red-400",
    borderColor: "border-red-500",
    logo: "/ytlogo.jpg",
  },
  "/facebook-video-downloader": {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-500",
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-400",
    borderColor: "border-blue-500",
    logo: null,
  },
  "/instagram-video-downloader": {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    gradientFrom: "from-pink-600",
    gradientTo: "to-pink-400",
    borderColor: "border-pink-500",
    logo: null,
  },
  "/tiktok-video-downloader": {
    name: "TikTok",
    icon: FaTiktok,
    color: "text-teal-500",
    gradientFrom: "from-teal-600",
    gradientTo: "to-teal-400",
    borderColor: "border-teal-500",
    logo: null,
  },
  "/snapchat-video-downloader": {
    name: "Snapchat",
    icon: FaSnapchat,
    color: "text-yellow-500",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-400",
    borderColor: "border-yellow-500",
    logo: null,
  },
}

export function ResponsiveHeader() {
  const pathname = usePathname()
  const config = platformConfig[pathname] || platformConfig["/"]
  const Icon = config.icon

  return (
    <header className="sticky top-0 z-50 bg-[#121620]/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo and Platform Name */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500`}
              ></div>
              <div className="relative">
                {config.logo ? (
                  <img
                    src={config.logo || "/placeholder.svg"}
                    alt={`${config.name} Downloader`}
                    className={`h-14 w-14 rounded-full border-2 ${config.borderColor} p-0.5 bg-gray-900 transform group-hover:scale-110 transition-transform duration-300`}
                  />
                ) : (
                  <div
                    className={`h-14 w-14 rounded-full border-2 ${config.borderColor} p-0.5 bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-8 w-8 ${config.color}`} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">{config.name}</span>
              <span className={`text-xl font-bold ${config.color}`}>Video Downloader</span>
            </div>
          </div>

          {/* Platform Selector - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            <PlatformSelector />
          </div>

          {/* Mobile Platform Selector and All Platforms Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Platform Selector */}
            <div className="md:hidden">
              <PlatformSelector />
            </div>

            {/* All Platforms Button */}
            <Link href="/">
              <Button className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-300 shadow-lg text-sm md:text-base px-3 md:px-4">
                <span className="hidden sm:inline">All Platforms</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
