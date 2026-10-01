import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieNotice from '@/components/CookieNotice'
import SessionProvider from '@/components/SessionProvider'
import { CartProvider } from '@/lib/cart-context'
import {
  OG_IMAGES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_IMAGES,
} from '@/lib/site'

// latin-ext is required for č, š, ž; with only 'latin' they fall back to a system font
const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Resolved against metadataBase, so every page gets its own canonical URL
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'sl_SI',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className={inter.className}>
        <Script
          defer
          data-domain="mojkmet.eu"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <SessionProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <CookieNotice />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
