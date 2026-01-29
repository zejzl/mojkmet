'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MK</span>
            </div>
            <span className="text-xl font-bold text-gray-900">mojkmet.eu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition">
              Proizvodi
            </Link>
            <Link href="/farms" className="text-gray-700 hover:text-green-600 transition">
              Kmetije
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition">
              Kako deluje
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition">
              O nas
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Nalaganje...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Pozdravljeni, {session.user?.name || session.user?.email}</span>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  Nadzorna plošča
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  Odjava
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  Prijava
                </Link>
                <Link 
                  href="/register" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-gray-700 hover:text-green-600 transition">
                Proizvodi
              </Link>
              <Link href="/farms" className="text-gray-700 hover:text-green-600 transition">
                Kmetije
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition">
                Kako deluje
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition">
                O nas
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition">
                    Nadzorna plošča
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-gray-700 hover:text-green-600 transition"
                  >
                    Odjava
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-green-600 transition">
                    Prijava
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
                  >
                    Registracija
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
