'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export function LanguageSelector() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // split out the last segment as potential locale
  const parts = pathname.split('/').filter(Boolean)
  const last = parts[parts.length - 1]
  const currentLocale = locales.some(l => l.code === last)
    ? last
    : 'en'

  // everything except that last locale segment
  const baseParts = currentLocale === last
    ? parts.slice(0, -1)
    : parts

  // only add a leading slash if there's actually something there
  const basePath = baseParts.length > 0
    ? '/' + baseParts.join('/')
    : ''

  const currentLocaleData = locales.find(l => l.code === currentLocale)!

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={() => setOpen(!open)}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:block">{currentLocaleData?.flag}</span>
        <span className="text-sm font-medium">{currentLocale.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-[150px] max-h-60 overflow-y-auto  z-50">
          {locales.map((locale) => (
            <Link
              key={locale.code}
              href={`${basePath}/${locale.code}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 text-white transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${locale.code === currentLocale ? 'bg-gray-700 font-semibold' : ''
                }`}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{locale.flag}</span>
              <span className="text-sm">{locale.name}</span>
            </Link>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}