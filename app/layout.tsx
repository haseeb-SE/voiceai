import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://youtubetomp4download.com'),
  title: "Free YTMP4 Download",
  description: "Download YouTube videos in MP3 and MP4 formats",
  icons: {
    icon: "/ytlogo.jpg",
  },
  openGraph: {
    title: "Free YTMP4 Download",
    description: "Download YouTube videos in MP3 and MP4 formats",
    url: "https://youtubetomp4download.com",
    siteName: "YouTube Downloader",
    images: [
      {
        url: "/Fav.svg",
        width: 1200,
        height: 630,
        alt: "Dynamo Downloader - YouTube Video Downloader",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ytlogo.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/ytlogo.jpg" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXXFX999RS"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5636423460612805"
          crossOrigin="anonymous"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GXXFX999RS');
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}