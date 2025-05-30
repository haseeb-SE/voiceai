import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SnailIcon as Snapchat } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"
import { ResponsiveHeader } from "@/components/responsive-header"

export const metadata: Metadata = {
    title: "Free Snapchat Video Downloader Online",
    description: "Download Snapchat videos easily and securely. Use the best Snapchat video downloader for fast video download from Snapchat to your device.",
    keywords:
        "Snapchat video downloader, Snapchat video download, Download Snapchat video, video download from Snapchat, Video download for Snapchat",
}

export default function SnapchatPage() {
    return (
        <div className="min-h-screen bg-[#121620] text-white">
            <ResponsiveHeader />

            {/* Hero Section - Reduced padding */}
            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-yellow-500 drop-shadow-lg">
                        Lightning Fast Snapchat Video Downloader
                    </h1>
                    <p className="text-l md:text-1xl font-medium text-white mb-4">
                        The Best Snapchat Video Downloader

                    </p>

                </div>
            </div>


            <section className="py-8" id="downloader">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <Card className="border border-gray-700 bg-gray-800/80 text-white shadow-2xl backdrop-blur-sm hover:shadow-yellow-500/10 transition-all duration-500">
                        <CardHeader className="border-b border-gray-700">
                            <CardTitle className="text-yellow-500 text-2xl md:text-3xl">Snapchat Video Downloader</CardTitle>
                            <CardDescription className="text-gray-300">
                                Enter a Snapchat story or video URL to download in MP3 or MP4 format
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
                        Our downloader gives you instant access to Snapchat video download features: no software, no login, just smooth performance. Download Snapchat video in seconds by pasting your link directly into our tool. Whether it’s a story or a memory, you’ll get a reliable, high-quality video download for Snapchat every time.

                    </p>
                </div>
            </section>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-red-400 mr-2">✓</span>
                    <span className="text-sm md:text-base">Choose SD or HD Video Quality</span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-red-400 mr-2">✓</span>
                    <span className="text-sm md:text-base">Works Seamlessly on Desktop and Mobile</span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-red-400 mr-2">✓</span>
                    <span className="text-sm md:text-base">Easy Video Download From Snapchat To Any Device</span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-red-400 mr-2">✓</span>
                    <span className="text-sm md:text-base">Convert and Download Snapchat Video Instantly</span>
                </div>


            </div>


            {/* Features Section with enhanced hover effects */}
            <section className="py-16 bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
                            Why Choose Our Snapchat Video Downloader?
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                Instant Snapchat Video Downloads
                            </h3>
                            <p className="text-gray-300">
                                Use our tool for fast, secure Snapchat video download without hassle. Paste the link and start downloading.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                Reliable Tool For Downloading Snapchat Videos
                            </h3>
                            <p className="text-gray-300">
                                This downloader handles everything from Stories to Snaps. Just input the URL, and your file is ready in moments.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                Download Snapchat Video in High Quality
                            </h3>
                            <p className="text-gray-300">
                                Enjoy top-tier video download for Snapchat with zero quality loss. Choose your format and resolution in just a few clicks.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                Simple & Unlimited Usage

                            </h3>
                            <p className="text-gray-300">
                                There are no limits. You can download Snapchat videos as often as needed: no accounts or caps.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                All-Platform Compatibility
                            </h3>
                            <p className="text-gray-300">
                                Our video downloader works across all operating systems and major browsers, including Chrome, Safari, and Firefox.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-yellow-500/20">
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-all duration-300">
                                <svg
                                    className="w-6 h-6 text-yellow-400"
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
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                                Download Snapchat Stories, Reels, and More
                            </h3>
                            <p className="text-gray-300">
                                Video download from Snapchat is made easy, no matter the content type.
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
                            How to Download Snapchat Videos
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Copy the Snap Link</h3>
                                <p className="text-gray-300">
                                    Find the Snapchat video you want. Copy its direct link from your app or browser.

                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Paste into the Snapchat Video Downloader</h3>
                                <p className="text-gray-300">
                                    Drop the link into our download field.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Select Format and Download</h3>
                                <p className="text-gray-300">
                                    Choose your format and resolution, then hit "Download" to save the video instantly.
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
                            <h3 className="text-xl font-bold text-white">Share Free Snapchat video Downloader:</h3>
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
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">
                                1. Is this Snapchat video downloader free to use?
                            </h3>
                            <p className="text-gray-300">
                                Yes, the video downloader is 100% free with no sign-up or hidden charges.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">2. Can I download a Snapchat video in MP4 format?</h3>
                            <p className="text-gray-300">
                                Absolutely. Use our tool to convert and download Snapchat videos in MP4 instantly.


                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">3. Does the video download from Snapchat work on all browsers?</h3>
                            <p className="text-gray-300">
                                Yes, the video download from Snapchat works on Chrome, Safari, Firefox, and others.

                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">4. Are there any download limits with this Snapchat video downloader?</h3>
                            <p className="text-gray-300">
                                No, you can use the Snapchat video downloader as often as needed.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">5. Can I use it to download videos for Snapchat Stories and Reels?</h3>
                            <p className="text-gray-300">
                                Yes, this tool supports video download for Snapchat content of all kinds.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">6. Is it safe to use this tool for Snapchat video download?</h3>
                            <p className="text-gray-300">
                                Yes, all video download from Snapchat is processed through encrypted, secure connections.
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
                                <div className="h-14 w-14 rounded-full border-2 border-yellow-500 p-0.5 bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <Snapchat className="h-8 w-8 text-yellow-500" />

                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Snapchat <span className="text-yellow-500">Video Downloader</span>
                                </h3>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Download Snapchat videos, reels, and stories – fast, free, & secure!
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Other Platforms</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        YouTube Video Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/facebook-video-downloader"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        Facebook Video Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tiktok-video-downloader"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        TikTok Video Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/snapchat-video-downloader"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        Snapchat Video Downloader
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
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy-policy"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
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
                            © {new Date().getFullYear()} TikTok Video Downloader. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Free Snapchat Video Downloader Online",
              url: "https://youtubetomp4download.com/snapchat-video-downloader",
              description:
                "Download Snapchat videos easily and securely. Use the best Snapchat video downloader for fast video download from Snapchat to your device.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Windows, macOS, Android, iOS",
              browserRequirements: "Chrome, Firefox, Safari, Edge",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Choose SD or HD Video Quality",
                "Works Seamlessly on Desktop and Mobile",
                "Easy Video Download From Snapchat To Any Device",
                "Convert and Download Snapchat Video Instantly",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Download Snapchat Videos",
              description: "Simple steps to download videos from Snapchat",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Copy the Snap Link",
                  text: "Find the Snapchat video you want. Copy its direct link from your app or browser.",
                },
                {
                  "@type": "HowToStep",
                  name: "Paste into the Snapchat Video Downloader",
                  text: "Drop the link into our download field.",
                },
                {
                  "@type": "HowToStep",
                  name: "Select Format and Download",
                  text: "Choose your format and resolution, then hit 'Download' to save the video instantly.",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is this Snapchat video downloader free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, the video downloader is 100% free with no sign-up or hidden charges.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I download a Snapchat video in MP4 format?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely. Use our tool to convert and download Snapchat videos in MP4 instantly.",
                  },
                },
              ],
            },
          ]),
        }}
      />
        </div>
    )
}
