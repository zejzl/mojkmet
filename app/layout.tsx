import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
