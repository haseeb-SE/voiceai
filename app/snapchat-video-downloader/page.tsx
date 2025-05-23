import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SnailIcon as Snapchat } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"
import { ResponsiveHeader } from "@/components/responsive-header"

export const metadata: Metadata = {
    title: "Snapchat Video Downloader | Download Snapchat Videos Free",
    description: "Download Snapchat stories and videos in MP4 or MP3 format. Free, fast, and no signup required.",
    keywords:
        "Snapchat downloader, Snapchat to MP4, Snapchat to MP3, download Snapchat videos, Snapchat story downloader",
}

export default function SnapchatPage() {
    return (
        <div className="min-h-screen bg-[#121620] text-white">
            <ResponsiveHeader />

            {/* Hero Section - Reduced padding */}
            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-yellow-500 drop-shadow-lg">
                        Snapchat Video Downloader
                    </h1>
                    <p className="text-l md:text-1xl font-medium text-white mb-4">
                        Download Snapchat to MP4 with the Best Video Downloader Online
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
                        Use our Snapchat video downloader to download and convert Snapchat to MP4 or MP3 securely. All you need is a
                        browser; no additional software installation is required. Experience high-resolution ytmp4 downloads.
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
                            Key Features of Our YTMP4 Downloader
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
                                Convert Snapchat to MP4 or MP3 in Seconds
                            </h3>
                            <p className="text-gray-300">
                                It converts YTMP4 links instantly. Paste, click, and download. It processes video links as soon as you
                                drop them in the search field, ensuring high-quality output files.
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
                                User-Centric Interface for Snapchat Video Downloads
                            </h3>
                            <p className="text-gray-300">
                                The downloader is built to convert Snapchat to MP4 efficiently with a simple interface. You just have to
                                paste your video link, select MP4 or MP3, and start the download. No technical background required.
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
                                Multi-Format Snapchat to MP4 Converter
                            </h3>
                            <p className="text-gray-300">
                                You can convert Snapchat to MP4 for the full video or extract MP3 audio with precision. It supports
                                flexible format selection, ensuring compatibility with your playback devices.
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
                                Download Snapchat to MP4 in HD and 4K
                            </h3>
                            <p className="text-gray-300">
                                Pick from the standard definition options, 1080p HD, or 4K resolution. This YTMP4 download platform
                                guarantees high visual clarity for every file.
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
                                Compatible with Windows and Mac Systems
                            </h3>
                            <p className="text-gray-300">
                                The Downloader is compatible with both operating systems: Mac and Windows. The YTMP4 process runs
                                entirely online without the need for any additional software or device-specific versions.
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
                                Fast and Secure Snapchat to MP4 Download Performance
                            </h3>
                            <p className="text-gray-300">
                                The downloader uses encrypted connections and secure servers. Your video downloads are private, fast,
                                and free from intrusive ads or tracking.
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
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Copy the Snapchat Link</h3>
                                <p className="text-gray-300">
                                    Find the story or video you want to download from Snapchat. Use the share option to copy the link to
                                    the content.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Paste & Analyze</h3>
                                <p className="text-gray-300">
                                    Paste the Snapchat link into our downloader tool. Click "Get Video Info" and our system will analyze
                                    the available download options.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 mt-4">Download Your Video</h3>
                                <p className="text-gray-300">
                                    Choose the desired format (MP4 or MP3) and click "Download". Your video will be ready for you to save.
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
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">
                                1. Is the downloader for Snapchat to MP4 free to use?
                            </h3>
                            <p className="text-gray-300">
                                Yes. The downloader offers unlimited Snapchat to MP4 download access without cost or subscription.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">2. Which formats are supported by the downloader?</h3>
                            <p className="text-gray-300">
                                You can convert Snapchat to MP4 for video or MP3 for audio. Other supported formats include WebM and
                                high-resolution variants.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">3. Does ytmp4 work on all browsers and devices?</h3>
                            <p className="text-gray-300">
                                Yes. This Snapchat to MP4 downloader is fully operational on Chrome, Safari, Firefox, and all major
                                browsers on mobile and desktop.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">4. Does ytmp4 support HD and 4K resolutions?</h3>
                            <p className="text-gray-300">
                                Yes. It allows Snapchat to make MP4 downloads in both HD and 4K resolutions.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">5. Do you have any file size or download limits?</h3>
                            <p className="text-gray-300">
                                No. The Snapchat to MP4 service is unlimited. You can download as many videos as needed.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">6. Is this Snapchat to MP4 converter secure?</h3>
                            <p className="text-gray-300">
                                Yes. All Snapchat to MP4 downloads are processed over encrypted HTTPS connections, ensuring privacy and
                                data protection with the downloader.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-yellow-400 mb-2">7. Why is my video not downloading?</h3>
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
                                <div className="h-14 w-14 rounded-full border-2 border-yellow-500 p-0.5 bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <Snapchat className="h-8 w-8 text-yellow-500" />

                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Snapchat <span className="text-yellow-500">Downloader</span>
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
                                        href="/youtube"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        YouTube Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/facebook"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        Facebook Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tiktok"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        TikTok Downloader
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/snapchat"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
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
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
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
                            © {new Date().getFullYear()} TikTok Video Downloader. All rights reserved.
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
