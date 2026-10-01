import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import FeaturedFarms from '@/components/FeaturedFarms'
import Categories from '@/components/Categories'
import TrustBadges from '@/components/TrustBadges'
import Newsletter from '@/components/Newsletter'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import {
  OG_IMAGES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_IMAGES,
} from '@/lib/site'

// Title, description and canonical come from the root layout. openGraph/twitter are repeated
// here so the home page uses the explicit image URLs (Next otherwise attaches the file-based
// opengraph-image to this segment, which can resolve against the deployment host).
export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'sl_SI',
    url: '/',
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: TWITTER_IMAGES,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      areaServed: { '@type': 'Country', name: 'Slovenija' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'sl-SI',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <JsonLd data={structuredData} />
      <Hero />
      <HowItWorks />
      <FeaturedFarms />
      <Categories />
      <TrustBadges />
      <Newsletter />
    </main>
  )
}
