import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"
import { PlatformSelector } from "@/components/platform-selector"

export const metadata: Metadata = {
  title: "Free YouTube To MP4 Download",
  description:
    "Convert YouTube to MP4 with the best YouTube video downloader online. Quick, free YouTube video converter to MP4.",
  keywords:
    "YouTube to MP4 download, youtube to mp4 converter, YouTube video to MP4, YouTube shorts to MP4, YouTube video converter to MP4, convert YouTube to MP4, download youtube to mp4",
  openGraph: {
    title: "Convert YouTube to MP4 Instantly | Free YTMP4 Download",
    description:
      "Convert YouTube to MP4 with the best YouTube video downloader online. Quick, free YTMP4 tool with no signup.",
    url: "https://youtubetomp4download.com",
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
  twitter: {
    card: "summary_large_image",
    title: "Free YTMP4 Download | Free YTMP4 Download",
    description:
      "Convert YouTube to MP4 with the best YouTube video downloader online. Quick, free YTMP4 tool with no signup.",
    images: ["/twitter-image.jpg"],
  },
}

export default function YouTubePage() {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      {/* Header Section with more prominent logo */}
      <header className="sticky top-0 z-50 bg-[#121620]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                <div className="relative">
                  <img
                    src="/ytlogo.jpg"
                    alt="YouTube Downloader"
                    className="h-14 w-14 rounded-full border-2 border-red-500 p-0.5 bg-gray-900 transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">YouTube</span>
                <span className="text-xl font-bold text-red-500">Downloader</span>
              </div>
            </div>

            <div>
              <Link href="/">
                <Button className="bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-300 shadow-lg">
                  All Platforms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Reduced padding */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-red-500 drop-shadow-lg">
            Fast & Free YouTube To MP4 Download
          </h1>
          <p className="text-l md:text-1xl font-medium text-white mb-4">The Best YouTube to MP4 Converter</p>
         
        </div>
      </div>

      <section className="py-8" id="downloader">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <Card className="border border-gray-700 bg-gray-800/80 text-white shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-red-500 text-2xl md:text-3xl">YouTube Video Downloader</CardTitle>
              <CardDescription className="text-gray-300">
                Enter a YouTube URL to download videos in MP3 or MP4 format
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <YoutubeDownloader />
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Platform Selector */}
      <section className="py-2">
        <div className="container mx-auto px-2">
          <PlatformSelector />
        </div>
      </section>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
        Enjoy a fast and free YouTube to MP4 download with our online tool. No software is needed; just paste your
        link into the browser and start converting. Experience seamless YouTube to MP4 converter performance with
        high-resolution output every time.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">Videos in HD or 4K resolution</span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">Compatible with Mac & Windows</span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">No Additional Software Or Plug-ins </span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">Convert Videos to MP4 or MP3</span>
        </div>
      </div>

      {/* Features Section with enhanced hover effects */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              Key Features of Our YouTube To MP4 Converter
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                Fast & Free YouTube to MP4 Download
              </h3>
              <p className="text-gray-300">
                Get a fast, free YouTube to MP4 download with our online tool. No software is needed; just paste the
                video link and start converting. Reliable, high-quality output is guaranteed every time.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                The Best YouTube to MP4 Converter
              </h3>
              <p className="text-gray-300">
                Use the best converter to convert a YouTube video to MP4 or YouTube Shorts to MP4. This tool delivers
                fast, high-quality downloads with no extra steps.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                Convert YouTube to MP4
              </h3>
              <p className="text-gray-300">
                Convert YouTube to MP4 online hassle-free. Just use your regular browser; no software installation is
                needed. Get high-resolution, fast, and easy YouTube to MP4 downloads every time.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                Convert YouTube Video to MP4
              </h3>
              <p className="text-gray-300">
                Paste any YouTube video URL to instantly convert YouTube video to MP4. Choose your format, then download
                your file in seconds with no delays.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                Convert YouTube Shorts to MP4
              </h3>
              <p className="text-gray-300">
                Convert YouTube Shorts to MP4 quickly and easily. The process is simple: paste the Short URL, select
                MP4, and get your video fast and reliably.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                Compatible with Mac & Windows
              </h3>
              <p className="text-gray-300">
                Our YouTube to MP4 converter works smoothly on both Mac and Windows. No downloads or plugins are
                required; just paste your link and convert it online in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with animated steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              3 Simple Steps to Convert YouTube Videos
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Grab the Link</h3>
                <p className="text-gray-300">
                  Find the video you want to download or convert from YouTube. Copy its full URL directly from the
                  browser's address bar.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Drop It In & Hit Go</h3>
                <p className="text-gray-300">
                  Paste the YouTube link into the ytmp4 tool's search field. Then, click on Download to begin converting
                  videos to MP3 or MP4.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Pick Your Format, Get Your File</h3>
                <p className="text-gray-300">
                  Choose MP4, MP3, 1080p, or even 4K. Hit Download, and your converted file will be ready in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 group">
              <a href="#downloader" className="flex items-center">
                Download Now
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  ></path>
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-8 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Share Free YTMP4 Download:</h3>
            </div>
            <ShareButtons />
          </div>
        </div>
      </section>

      {/* FAQ Section with animated accordions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              Frequently Asked Questions
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                1. Is the downloader for YouTube to MP4 free to use?
              </h3>
              <p className="text-gray-300">
                Yes. The downloader offers unlimited YouTube to MP4 download access without cost or subscription.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">2. Which formats are supported by the downloader?</h3>
              <p className="text-gray-300">
                You can convert YouTube to MP4 for video or MP3 for audio. Other supported formats include WebM and
                high-resolution variants.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                3. Does YouTube to MP4 work on all browsers and devices?
              </h3>
              <p className="text-gray-300">
                Yes. This YouTube to MP4 downloader is fully operational on Chrome, Safari, Firefox, and all major
                browsers on mobile and desktop.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">4. Does ytmp4 support HD and 4K resolutions?</h3>
              <p className="text-gray-300">
                Yes. It allows YouTube to make MP4 downloads in both HD and 4K resolutions.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">5. Do you have any file size or download limits?</h3>
              <p className="text-gray-300">
                No. The YouTube to MP4 service is unlimited. You can download as many videos as needed.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">6. Is this YouTube to MP4 converter secure?</h3>
              <p className="text-gray-300">
                Yes. All YouTube to MP4 downloads are processed over encrypted HTTPS connections, ensuring privacy and
                data protection with the downloader.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">7. Why is my video not downloading?</h3>
              <p className="text-gray-300">
                If you're experiencing issues, check if the video is public and not restricted. Try refreshing the page
                and entering the link again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121620] py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/ytlogo.jpg"
                  alt="YouTube Downloader"
                  className="h-10 w-10 rounded-full border border-red-500"
                />
                <h3 className="text-xl font-bold text-white">
                  YouTube <span className="text-red-500">Downloader</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-4">Download YouTube videos and shorts – fast, free, & secure!</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Other Platforms</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/facebook"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Facebook Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Instagram Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    TikTok Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/snapchat"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Snapchat Downloader
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500">© {new Date().getFullYear()} YouTube Video Downloader. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free YTMP4 Download",
            url: "https://youtubetomp4download.com",
            description:
              "Download YouTube videos in MP4, 1080p HD, 4K, and MP3 formats for free. No software needed, works on all devices.",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Windows, macOS, Android, iOS",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </div>
  )
}
