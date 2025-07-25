import { YoutubeDownloader } from "@/components/youtube-downloader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/ShareButtons"
import { ResponsiveHeader } from "@/components/responsive-header"
import { redirect } from 'next/navigation'


type FeaturesSectionItem = {
  title: string;
  desc: string;
};
type Dict = {
  [key: string]: string
  featuresSection: FeaturesSectionItem[];
}

// Helper to load messages
async function getDictionary(locale: string): Promise<Dict> {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch {
    // fallback to English if translation missing
    return (await import(`../../messages/en.json`)).default
  }
}



export default async function YouTubePage({ params }: { params: { locale: string } }) {
  const locale = params.locale

  const supportedLocales = [
    'en', 'fr', 'es',
    'id', 'pt', 'sv',
    'ar', 'zh', 'de',
    'hu', 'hi'
  ];
  const selectedLocale = supportedLocales.includes(locale) ? locale : "en"

  const dict = await getDictionary(
    selectedLocale as
    | 'en' | 'fr' | 'es'
    | 'id' | 'pt' | 'sv'
    | 'ar' | 'zh' | 'de'
    | 'hu' | 'hi'
  );

  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <ResponsiveHeader locale={locale} />

      {/* Hero Section - Reduced padding */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-red-500 drop-shadow-lg">
            {dict.welcome || "Fast & Free YouTube To MP4 Download"}
          </h1>
          <p className="text-l md:text-1xl font-medium text-white mb-4">{dict.subtitle || "The Best YouTube to MP4 Converter"}</p>

        </div>
      </div>

      <section className="py-8" id="downloader">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <Card className="border border-gray-700 bg-gray-800/80 text-white shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-red-500 text-2xl md:text-3xl">{dict.downloaderTitle || "YouTube Video Downloader"}</CardTitle>
              <CardDescription className="text-gray-300">
                {dict.downloaderDescription || "Enter a YouTube URL to download videos in MP3 or MP4 format"}
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
            {dict.downloaderPara}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">{dict.feature1 || "Videos in HD or 4K resolution"}</span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">{dict.feature2 || "Compatible with Mac & Windows"}</span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">{dict.feature3 || "Convert YouTube Shorts To MP4"}</span>
        </div>
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <span className="text-red-400 mr-2">✓</span>
          <span className="text-sm md:text-base">{dict.feature4 || "Convert Videos to MP4 or MP3"}</span>
        </div>
      </div>

      {/* Features Section with enhanced hover effects */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              {dict.featuresTitle || "Key Features of Our YouTube To MP4 Converter"}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 1 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Lightning bolt icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[0]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[0]?.desc}</p>
            </div>
            {/* 2 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Star icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[1]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[1]?.desc}</p>
            </div>
            {/* 3 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Switch icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[2]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[2]?.desc}</p>
            </div>
            {/* 4 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Video play icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[3]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[3]?.desc}</p>
            </div>
            {/* 5 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Shorts icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[4]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[4]?.desc}</p>
            </div>
            {/* 6 */}
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg group hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                {/* Devices icon */}
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                {dict.featuresSection[5]?.title}
              </h3>
              <p className="text-gray-300">{dict.featuresSection[5]?.desc}</p>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section with animated steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
              {dict.howItWorksTitle || "3 Simple Steps to Convert YouTube Videos"}
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
                <h3 className="text-xl font-bold text-white mb-3 mt-4">
                  {dict.step1Title || "Grab the Link"}
                </h3>
                <p className="text-gray-300">
                  {dict.step1Description || "Find the video you want to download or convert from YouTube. Copy its full URL directly from the browser's address bar."}
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">
                  {dict.step2Title || "Drop It In & Hit Go"}
                </h3>
                <p className="text-gray-300">
                  {dict.step2Description || "Paste the YouTube link into the ytmp4 tool's search field. Then, click on Download to begin converting videos to MP3 or MP4."}
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-4">
                  {dict.step3Title || "Pick Your Format, Get Your File"}
                </h3>
                <p className="text-gray-300">
                  {dict.step3Description || "Choose MP4, MP3, 1080p, or even 4K. Hit Download, and your converted file will be ready in seconds."}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 group">
              <a href="#downloader" className="flex items-center">
                {dict.downloadNow || "Download Now"}
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
              <h3 className="text-xl font-bold text-white">{dict.shareSectionTitle}</h3>
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
              {dict.faqTitle}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                1. {dict.faq1q}
              </h3>
              <p className="text-gray-300">
                {dict.faq2a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">2. {dict.faq2q}</h3>
              <p className="text-gray-300">
                {dict.faq2a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                3. {dict.faq3q}
              </h3>
              <p className="text-gray-300">
                {dict.faq3a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">4. {dict.faq4q}</h3>
              <p className="text-gray-300">
                {dict.faq4a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">5. {dict.faq5q}</h3>
              <p className="text-gray-300">
                {dict.faq5a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">6. {dict.faq6q}</h3>
              <p className="text-gray-300">
                {dict.faq6a}
              </p>
            </div>

            <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">7. {dict.faq7q}</h3>
              <p className="text-gray-300">
                {dict.faq7a}
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
                  {dict.yt}  <span className="text-red-500">{dict.yd}</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-4">{dict.footerDescription}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">{dict.otherPlatforms}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/facebook-video-downloader"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.fbVD}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram-video-downloader"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.instaVD}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok-video-downloader"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.tkVD}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/snapchat-video-downloader"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.snVD}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">{dict.quickLinks}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {dict.terms}
                  </Link>
                </li>

              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500">© {new Date().getFullYear()} {dict.allRightsReserved}</p>
          </div>
        </div>
      </footer>



      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Free YouTube To MP4 Download",
              url: "https://youtubetomp4download.com",
              description:
                "Convert YouTube to MP4 with the best YouTube video downloader online. Quick, free YouTube video converter to MP4.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Windows, macOS, Android, iOS",
              browserRequirements: "Chrome, Firefox, Safari, Edge",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "YouTube to MP4 conversion",
                "HD and 4K video downloads",
                "YouTube Shorts support",
                "No software installation required",
                "Cross-platform compatibility",
              ],
              screenshot: "/Fav.svg",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "YouTube Video Downloader",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },

            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Download YouTube Videos to MP4",
              description: "Step-by-step guide to download YouTube videos in MP4 format",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Copy YouTube URL",
                  text: "Find the video you want to download or convert from YouTube. Copy its full URL directly from the browser's address bar.",
                },
                {
                  "@type": "HowToStep",
                  name: "Paste URL and Convert",
                  text: "Paste the YouTube link into the ytmp4 tool's search field. Then, click on Download to begin converting videos to MP3 or MP4.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download Video",
                  text: "Choose MP4, MP3, 1080p, or even 4K. Hit Download, and your converted file will be ready in seconds.",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is the downloader for YouTube to MP4 free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The downloader offers unlimited YouTube to MP4 download access without cost or subscription.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which formats are supported by the downloader?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can convert YouTube to MP4 for video or MP3 for audio. Other supported formats include WebM and high-resolution variants.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does YouTube to MP4 work on all browsers and devices?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. This YouTube to MP4 downloader is fully operational on Chrome, Safari, Firefox, and all major browsers on mobile and desktop.",
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
