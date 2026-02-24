'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import CurrencySwitcher from './CurrencySwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/userUtils'
import { useAuthSync } from '@/lib/useAuthSync'
import { useAuth } from '@/components/AuthProvider'

export default function Header({ lang = 'en', dict }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Handle auth events from other tabs
  const handleAuthEvent = useCallback(async (event) => {
    // Rely on AuthProvider and useAuthSync for session updates
    // In AuthProvider it will re-fetch if this tab is active
  }, [])

  // Cross-tab sync via Supabase Realtime
  useAuthSync({
    userId: user?.id,
    onAuthEvent: handleAuthEvent
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        toggleMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  // Handle mobile menu toggle without history hacking
  const toggleMenu = useCallback((open) => {
    setIsMenuOpen(open)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-100' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
            <Image
              src="/img/logo.png"
              alt="GoHoliday Logo"
              width={140}
              height={40}
              className="h-[40px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-between">
            {/* Main Navigation Links (Center) */}
            <div className="flex-1 flex justify-center">
              <Link href={`/${lang}/tours`} className="relative text-gray-700 hover:text-primary-600 transition-colors font-bold group px-4 py-2 text-lg">
                {dict?.nav?.tours || 'Discover Tours'}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Action Items */}
            <div className="flex items-center gap-3">
              <CurrencySwitcher />
              <LanguageSwitcher />

              {/* Auth Section */}
              {user ? (
                <Link
                  href={`/${lang}/profile`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-semibold text-sm">{getUserDisplayName(user)}</span>
                </Link>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {dict?.nav?.login || 'Login'}
                </Link>
              )}
            </div>
          </nav>

          {/* MOBILE HEADER (App-like layout: Menu | Logo | Profile/Login) */}
          <div className="md:hidden flex items-center justify-between h-16 w-full relative z-[51] bg-transparent">
            {/* Left: Hamburger Button */}
            <div className="w-16 flex justify-start">
              <button
                ref={menuButtonRef}
                onClick={() => toggleMenu(!isMenuOpen)}
                className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                aria-label="Toggle menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Center: Logo */}
            <Link href={`/${lang}`} className="flex-1 flex justify-center hover:opacity-90 transition-opacity">
              <Image
                src="/img/logo.png"
                alt="GoHoliday Logo"
                width={120}
                height={34}
                className="h-[34px] w-auto relative z-10"
                priority
              />
            </Link>

            {/* Right: Profile / Login Action */}
            <div className="w-16 flex justify-end">
              {user ? (
                <Link
                  href={`/${lang}/profile`}
                  className="p-1 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
                  onClick={() => toggleMenu(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 border-2 border-primary-100 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition-all shadow-sm active:scale-95"
                  onClick={() => toggleMenu(false)}
                >
                  {dict?.nav?.login || 'Login'}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width Mobile Menu Overlay Dropdown */}
        <div
          ref={menuRef}
          className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out z-[50] ${isMenuOpen ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
        >
          <div className="px-4 py-6 space-y-6">
            {/* Navigation Links Section */}
            <div className="space-y-2">
              <Link
                href={`/${lang}/tours`}
                className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-primary-50 active:bg-primary-100 border border-gray-100 rounded-2xl transition-all duration-200"
                onClick={() => toggleMenu(false)}
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 border border-gray-100/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{dict?.nav?.tours || 'Explore Tours'}</div>
                  <div className="text-sm font-medium text-gray-500">Find your next adventure</div>
                </div>
              </Link>
            </div>

            {/* Switchers Section */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Currency</div>
                <CurrencySwitcher mobile />
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Language</div>
                <LanguageSwitcher mobile />
              </div>
            </div>

            {/* Dynamic Account Action (Bottom) */}
            <div className="pt-2">
              {user && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut({ scope: 'local' });
                    toggleMenu(false);
                    router.refresh();
                  }}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-2xl transition-all font-bold group shadow-sm"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

  )
}

