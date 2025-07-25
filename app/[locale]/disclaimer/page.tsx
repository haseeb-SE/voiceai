// app/[locale]/disclaimer/page.tsx
import Link from "next/link"
import type { Metadata } from "next"
import { ResponsiveHeader } from "@/components/responsive-header"

type Dict = {
  pageTitle: string
  section1Title: string
  section1Text: string
  section2Title: string
  section2Text: string
  section3Title: string
  section3Text: string
  section4Title: string
  section4Text: string
  backLink: string
}

// dynamically load the correct JSON
async function getDictionary(locale: string): Promise<Dict> {
  try {
    return (await import(`../../../messages/disc-${locale}.json`)).default
  } catch {
    return (await import(`../../../messages/disc-en.json`)).default
  }
}

export const metadata: Metadata = {
  title: "Disclaimer – YTMP4 Downloader",
  description: "Disclaimer for YTMP4 Downloader – YouTube video downloader service.",
}

export default async function DisclaimerPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const supported = ['en', 'fr', 'es', 'id', 'pt', 'sv', 'ar', 'zh', 'de', 'hu', 'hi']
  const lang = supported.includes(locale) ? locale : 'en'
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ResponsiveHeader locale={locale} />


      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-red-500">
          {dict.pageTitle}
        </h1>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {dict.section1Title}
            </h2>
            <p>{dict.section1Text}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {dict.section2Title}
            </h2>
            <p>{dict.section2Text}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {dict.section3Title}
            </h2>
            <p>{dict.section3Text}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {dict.section4Title}
            </h2>
            <p>{dict.section4Text}</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link href={`/${lang}`} className="text-red-500 hover:text-red-400 transition-colors">
            {dict.backLink}
          </Link>
        </div>
      </div>
    </div>
  )
}
