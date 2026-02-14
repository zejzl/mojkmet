import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieNotice from '@/components/CookieNotice'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'mojkmet.eu - Sveže od kmeta, neposredno k vam',
  description: 'Kupujte sveže kmetijske pridelke neposredno od slovenskih kmetov. Brez posrednikov, poštene cene, svežina zagotovljena.',
  keywords: 'kmetija, lokalni pridelki, sveža hrana, kmetijski proizvodi, slovenske kmetije',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <Header />
          {children}
          <Footer />
          <CookieNotice />
        </SessionProvider>
      </body>
    </html>
  )
}
