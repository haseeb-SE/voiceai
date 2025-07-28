'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Youtube, Facebook, Instagram } from 'lucide-react'
import { FaTiktok, FaSnapchat } from 'react-icons/fa'
import { PlatformSelector } from './platform-selector'

const supportedLocales = ['en','fr','es','id','pt','sv','ar','zh','de','hu','hi']

// move this into a shared file if you like
const PLATFORMS = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    path: '/',  
    color: 'text-red-500',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-400',
    borderColor: 'border-red-500',
    logo: '/ytlogo.jpg',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    path: '/facebook-video-downloader',
    color: 'text-blue-500',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-400',
    borderColor: 'border-blue-500',
    logo: null,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    path: '/instagram-video-downloader',
    color: 'text-pink-500',
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-pink-400',
    borderColor: 'border-pink-500',
    logo: null,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: FaTiktok,
    path: '/tiktok-video-downloader',
    color: 'text-teal-500',
    gradientFrom: 'from-teal-600',
    gradientTo: 'to-teal-400',
    borderColor: 'border-teal-500',
    logo: null,
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: FaSnapchat,
    path: '/snapchat-video-downloader',
    color: 'text-yellow-500',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-yellow-400',
    borderColor: 'border-yellow-500',
    logo: null,
  },
]

interface ResponsiveHeaderProps {
  locale: string
}

export function ResponsiveHeader({ locale }: ResponsiveHeaderProps) {
  const pathname = usePathname()

  // 1. strip off any leading/trailing locale
  let parts = pathname.split('/').filter(Boolean)
  if (supportedLocales.includes(parts[0])) parts.shift()
  if (supportedLocales.includes(parts[parts.length - 1])) parts.pop()
  const cleanPath = parts.length > 0 ? `/${parts.join('/')}` : '/'

  // 2. find current platform
  const current = PLATFORMS.find(p => p.path === cleanPath) ?? PLATFORMS[0]

  // 3. build the nav of other platforms
  const otherPlatforms = PLATFORMS.filter(p => p.id !== current.id)

  return (
    <header className="sticky top-0 z-50 bg-[#121620]/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        {/* Logo + Title */}
        <Link href={`/${locale}${current.path}`} className="flex items-center gap-4">
          <div className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo} rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500`}
            />
            <div className="relative">
              {current.logo ? (
                <img
                  src={current.logo}
                  alt={`${current.name} Downloader`}
                  className={`h-14 w-14 rounded-full border-2 ${current.borderColor} p-0.5 bg-gray-900 transform group-hover:scale-110 transition-transform duration-300`}
                />
              ) : (
                <div
                  className={`h-14 w-14 rounded-full border-2 ${current.borderColor} p-0.5 bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <current.icon className={`h-8 w-8 ${current.color}`} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{current.name}</span>
            <span className={`text-sm font-bold ${current.color}`}>Downloader</span>
          </div>
        </Link>

        {/* Desktop nav: show only the OTHER platforms */}
        <nav className="hidden md:flex items-center gap-2">
          {otherPlatforms.map(p => (
            <Link
              key={p.id}
              href={`/${locale}${p.path}`}
              className={`group relative px-3 py-2 rounded-lg text-white bg-gray-800 border ${p.borderColor} hover:bg-gray-700 transition-all duration-300`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${p.gradientFrom} ${p.gradientTo} rounded-lg opacity-50 group-hover:opacity-100 blur group-hover:blur-sm transition-all duration-300`}
              />
              <div className="relative flex items-center gap-2">
                <p.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            </Link>
          ))}
          <LanguageSelector />
        </nav>

        {/* Mobile: platform selector + language */}
        <div className="md:hidden flex items-center gap-2">
          <PlatformSelector />
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}
