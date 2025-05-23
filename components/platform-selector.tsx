"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Youtube, Facebook, Instagram, ChevronDown, Menu } from "lucide-react"
import { FaTiktok, FaSnapchat } from "react-icons/fa"
import { Button } from "@/components/ui/button"

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    borderColor: "border-red-500",
    textColor: "text-red-500",
    gradientFrom: "from-red-600",
    gradientTo: "to-red-400",
    path: "/",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-400",
    path: "/facebook-video-downloader",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-pink-600",
    hoverColor: "hover:bg-pink-700",
    borderColor: "border-pink-500",
    textColor: "text-pink-500",
    gradientFrom: "from-pink-600",
    gradientTo: "to-pink-400",
    path: "/instagram-video-downloader",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "bg-teal-600",
    hoverColor: "hover:bg-teal-700",
    borderColor: "border-teal-500",
    textColor: "text-teal-500",
    gradientFrom: "from-teal-600",
    gradientTo: "to-teal-400",
    path: "/tiktok-video-downloader",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: FaSnapchat,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-500",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-400",
    path: "/snapchat-video-downloader",
  },
]

export function PlatformSelector() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpen])

  // Find current platform
  const currentPlatform = platforms.find((platform) => pathname === platform.path) || platforms[0]

  // Get other platforms (excluding current)
  const otherPlatforms = platforms.filter((platform) => platform.path !== pathname)

  // Desktop version
  if (!isMobile) {
    return (
      <div className="hidden md:flex items-center gap-2">
        {otherPlatforms.map((platform) => {
          const Icon = platform.icon
          return (
            <Link href={platform.path} key={platform.id}>
              <div className="group relative">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${platform.gradientFrom} ${platform.gradientTo} rounded-lg opacity-50 group-hover:opacity-100 blur group-hover:blur-sm transition-all duration-300`}
                ></div>
                <div
                  className={`relative flex items-center gap-2 px-3 py-2 bg-gray-800 ${platform.borderColor} border rounded-lg text-white group-hover:bg-gray-700 transition-all duration-300 transform group-hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  // Mobile version with dropdown
  return (
    <div className="md:hidden relative" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
        <span className="text-sm">Platforms</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            {otherPlatforms.map((platform) => {
              const Icon = platform.icon
              return (
                <Link href={platform.path} key={platform.id} onClick={() => setIsOpen(false)} className="block">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 transition-colors duration-200 group`}
                  >
                    <div
                      className={`p-1.5 rounded-full ${platform.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
