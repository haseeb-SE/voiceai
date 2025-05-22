import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"

export const metadata: Metadata = {
  title: "Free Facebook Video Downloader Online",
  description:
    "Download Facebook videos quickly and for free. Use the best Facebook video downloader to convert Facebook videos to MP4 without software.",
  keywords:
    "Facebook video downloader, download facebook video, Convert Facebook video to MP4, Facebook video download, download videos Facebook",
}

export default function FacebookPage() {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-[#121620]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-2 border-blue-500 p-0.5 bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Facebook className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Facebook</span>
                <span className="text-xl font-bold text-blue-500">Downloader</span>
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
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-blue-500 drop-shadow-lg">
            Top-Rated Facebook Video Downloader
          </h1>
          <p className="text-l md:text-1xl font-medium text-white mb-4">Facebook Video Download Is Now The Easiest!</p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Easily download Facebook videos with our efficient Facebook video downloader. No apps or plugins are
            required; just paste the video link and get a high-quality Facebook video download instantly.
          </p>
        </div>
      </div>

      <section className="py-8" id="downloader">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <Card className="border border-gray-700 bg-gray-800/80 text-white shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-blue-500 text-2xl md:text-3xl">Facebook Video Downloader</CardTitle>
              <CardDescription className="text-gray-300">
                Enter a Facebook URL to download videos in MP3 or MP4 format
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <YoutubeDownloader />
            </CardContent>
          </Card>
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
              Why Choose Our Facebook Video Downloader?
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                Lightning-Fast & Completely Free
              </h3>
              <p className="text-gray-300">
                Our online tool offers a lightning-fast way to download Facebook videos without any cost. Simply paste
                the Facebook video URL and enjoy quick downloads every time.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                Seamless Facebook Video to MP4 Conversion
              </h3>
              <p className="text-gray-300">
                Convert Facebook video to MP4 in just a few clicks. You will get a high-quality output without any
                interruptions or complicated steps.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                Simple & User-Friendly Facebook Video Download
              </h3>
              <p className="text-gray-300">
                Forget complicated software. Paste the Facebook video link into our downloader and get your file within
                seconds, which is compatible with all browsers and devices.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                Unlimited Facebook Video Downloads
              </h3>
              <p className="text-gray-300">
                Download videos from Facebook without limits or subscription fees. Use our service as often as you like.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                Cross-Platform Compatibility
              </h3>
              <p className="text-gray-300">
                Whether on Mac or Windows, our Facebook video downloader works smoothly on all major browsers without
                additional installations.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-500/20">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
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
              <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                HD Video Quality Every Time
              </h3>
              <p className="text-gray-300">
                Choose from multiple quality options, including HD, to ensure your downloaded Facebook videos look
                perfect.
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
              How to Download Video from Facebook?
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Find the Video</h3>
                <p className="text-gray-300">
                  Figure out which of the Facebook videos you want to download. Right-click and copy the video URL or
                  use the "Copy link" option.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Paste the Link & Start Downloading</h3>
                <p className="text-gray-300">
                  Paste the Facebook video URL into our Facebook video downloader search box. Click "Download" to begin
                  processing.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">Select Format & Save</h3>
                <p className="text-gray-300">
                  Choose the MP4 format and video quality you want, then click "Download" again to save the file to your
                  device instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 group">
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
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                1. Is this Facebook video downloader free to use?
              </h3>
              <p className="text-gray-300">Yes, our downloader is fully free with no hidden fees.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                2. Can I convert Facebook video to MP4 using this downloader?
              </h3>
              <p className="text-gray-300">
                Yes, you can easily convert Facebook video to MP4 with fast, high-quality results.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                3. Does the Facebook video download work on all devices?
              </h3>
              <p className="text-gray-300">Yes, the Facebook video download works on all major browsers and devices.</p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                4. Are there any limits when I download videos from Facebook?
              </h3>
              <p className="text-gray-300">
                No, you can download videos from Facebook unlimited times using our downloader.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                5. Can I use this tool to download Facebook reels as well?
              </h3>
              <p className="text-gray-300">
                Yes, use the downloader to download Facebook reels and convert them to MP4.
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                6. Is the Facebook video downloader secure for downloading videos from Facebook?
              </h3>
              <p className="text-gray-300">Yes, it uses secure, encrypted connections for safe downloads.</p>
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
                <div className="h-10 w-10 rounded-full border border-blue-500 flex items-center justify-center">
                  <Facebook className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Facebook <span className="text-blue-500">Downloader</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-4">Download Facebook videos and reels – fast, free, & secure!</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Other Platforms</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/youtube"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    YouTube Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Instagram Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    TikTok Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/snapchat"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
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
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Facebook Video Downloader. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Structublue Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free YTMP4 Download",
            url: "https://youtubetomp4download.com",
            description:
              "Download Facebook videos in MP4, 1080p HD, 4K, and MP3 formats for free. No software needed, works on all devices.",
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
