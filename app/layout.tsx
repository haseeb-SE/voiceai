import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <link  rel="icon" href="/ytlogo.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/ytlogo.jpg" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
