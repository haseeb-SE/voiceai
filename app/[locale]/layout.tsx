import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { notFound } from 'next/navigation'

const locales = ['en', 'fr', 'es',
  'id', 'pt', 'sv',
  'ar', 'zh', 'de',
  'hu', 'hi']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles = {
    en: "Free YouTube To MP4 Download",
    fr: "Téléchargement YouTube vers MP4 gratuit",
    es: "Descarga gratuita de YouTube a MP4"
  }

  const descriptions = {
    en: "Convert YouTube to MP4 with the best YouTube video downloader online. Quick, free YouTube video converter to MP4.",
    fr: "Convertissez YouTube en MP4 avec le meilleur téléchargeur de vidéos YouTube en ligne. Convertisseur YouTube vers MP4 rapide et gratuit.",
    es: "Convierte YouTube a MP4 con el mejor descargador de videos de YouTube en línea. Conversor rápido y gratuito de YouTube a MP4."
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `https://youtubetomp4download.com/${locale}`,
      siteName: "Free YTMP4 Download",
      images: [
        {
          url: "/Fav.svg",
          width: 1200,
          height: 630,
          alt: "Free YTMP4 Download- YouTube Video Downloader",
        },
      ],
      type: "website",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}