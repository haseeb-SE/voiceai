import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"
import { ResponsiveHeader } from "@/components/responsive-header"

export const metadata: Metadata = {
  title: "Free Instagram Video Downloader Online",
  description:
    "Quickly download Insta videos and reels for free. Use the easiest Instagram video downloader to save high-quality videos without installing anything.",
  keywords:
    "Instagram video downloader, Download Insta video, Download Insta Reels, free instagram video downloader, Download Insta videos",
}

export default function InstagramPage() {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <ResponsiveHeader />


      {/* Hero Section - Reduced padding */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-pink-500 drop-shadow-lg">
            Download With Free Instagram Videos Downloader
          </h1>
          <p className="text-l md:text-1xl font-medium text-white mb-4">Instantly Download Insta Videos</p>

        </div>
      </div>

      <section className="py-8" id="downloader">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <Card className="border border-gray-700 bg-gray-800/80 text-white shadow-2xl backdrop-blur-sm hover:shadow-pink-500/10 transition-all duration-500">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-pink-500 text-2xl md:text-3xl">Instagram Video Downloader</CardTitle>
              <CardDescription className="text-gray-300">
                Enter an Instagram video URL to download in MP3 or MP4 format
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <YoutubeDownloader />
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-8 bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-8">
          <p className="mt-8 text-center text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Download Insta videos and reels quickly using our free Instagram video downloader. No software or app
            installation required. Just paste the Instagram video or reel link and start downloading high-quality MP4
            files instantly.
          </p>
        </div>
      </section>
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
              Why Choose Our Free Instagram Video Downloader?
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-600 to-pink-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                Fast and Simple to Use
              </h3>
              <p className="text-gray-300">
                Download Insta reels and save videos quickly by pasting the URL. No complex steps or delays.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                High-Quality MP4 Downloads
              </h3>
              <p className="text-gray-300">Download Insta video files in MP4 format with clear resolution.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                Compatible with All Devices
              </h3>
              <p className="text-gray-300">Our downloader works on phones, tablets, Windows, and Mac.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                Unlimited Instagram Video Downloads
              </h3>
              <p className="text-gray-300">Download Instagram videos and reels without restrictions or fees.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                No App or Software Required
              </h3>
              <p className="text-gray-300">Download Instagram videos directly online. No downloads needed.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-pink-500/20">
              <div className="bg-pink-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-colors">
                Secure and Private
              </h3>
              <p className="text-gray-300">
                All downloads are processed over encrypted connections to protect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              3 Easy Steps to Download Insta Reels & Videos
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-600 to-pink-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Copy the Link</h3>
                <p className="text-gray-300">
                  Find the Instagram video or reel you want to download. Copy its URL from the app or browser.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Paste the Link & Start</h3>
                <p className="text-gray-300">
                  Paste the Instagram video link into our downloader's search box. Click the Download button to begin.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Choose Format & Save</h3>
                <p className="text-gray-300">
                  Select MP4 format and preferred quality, then hit Download. Your Insta video will be saved in seconds.
                </p>
              </div>
            </div>
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
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-600 to-pink-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">
                1. Is this Instagram video downloader free to use?
              </h3>
              <p className="text-gray-300">
                Yes, our Instagram video downloader is totally free of cost. You can download Instagram videos and reels
                without any charges or subscriptions.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">
                2. Can I download Instagram videos and reels in MP4 format?
              </h3>
              <p className="text-gray-300">
                Absolutely. Our downloader converts Instagram videos and reels to MP4 quickly and reliably.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">3. Does the downloader work on all devices?</h3>
              <p className="text-gray-300">
                Yes, this Instagram video downloader supports all major browsers on mobile and desktop devices.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">
                4. Are there any limits on downloading Instagram videos?
              </h3>
              <p className="text-gray-300">
                No, you can download Instagram videos and reels as many times as you want without any restrictions.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">5. Do I need to install any app or software?</h3>
              <p className="text-gray-300">No, you don't need any software or app. Our tool works fully online.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-pink-400 mb-2">
                6. Is this Instagram video downloader safe and secure?
              </h3>
              <p className="text-gray-300">
                Yes, all downloads happen over encrypted connections, ensuring your privacy and security.
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
                <div className="h-10 w-10 rounded-full border border-pink-500 flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Instagram <span className="text-pink-500">Downloader</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                Download Instagram videos, reels, and stories – fast, free, & secure!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Other Platforms</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    YouTube Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/facebook-video-downloader"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Facebook Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok-video-downloader"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    TikTok Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/snapchat-video-downloader"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
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
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Terms & Conditions
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Instagram Video Downloader. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Structure Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free YTMP4 Download",
            url: "https://youtubetomp4download.com",
            description:
              "Download Instagram videos in MP4, 1080p HD, 4K, and MP3 formats for free. No software needed, works on all devices.",
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
