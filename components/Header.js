'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import CurrencySwitcher from './CurrencySwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/userUtils'
import { useAuthSync } from '@/lib/useAuthSync'

export default function Header({ lang = 'en', dict }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  // Handle auth events from other tabs
  const handleAuthEvent = useCallback(async (event) => {
    if (event.type === 'email_updated' || event.type === 'email_verified') {
      if (supabase) {
        try {
          const { data: { user: freshUser }, error } = await supabase.auth.getUser()
          if (!error && freshUser) {
            setUser(freshUser)
          }
        } catch (err) {
          // Silently handle errors
        }
      }
    }
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
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    // Check current session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism shadow-glass' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
            <Image
              src="/img/logo.png"
              alt="GoHoliday Logo"
              width={160}
              height={46}
              className="h-[46px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Main Navigation Links */}
            <div className="flex items-center">
              <Link href={`/${lang}/tours`} className="relative text-gray-700 hover:text-primary-600 transition-colors font-bold group">
                {dict?.nav?.tours || 'Tours'}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Action Items */}
            <div className="flex items-center gap-1">
              <CurrencySwitcher />
              <LanguageSwitcher />

              {/* Auth Section */}
              {user ? (
                <Link
                  href={`/${lang}/profile`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{getUserDisplayName(user)}</span>
                </Link>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {dict?.nav?.login || 'Login'}
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Actions (Icon + Hamburger) */}
          <div className="md:hidden flex items-center gap-1">
            {/* Mobile Profile Icon */}
            {user ? (
              <Link
                href={`/${lang}/profile`}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 border border-primary-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </Link>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Hamburger Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden pb-4 animate-slide-down bg-white absolute right-4 top-16 w-52 shadow-2xl border border-gray-100 rounded-2xl z-[60]">
            {/* Navigation Links Section */}
            <div className="px-3 py-4 space-y-1">
              <Link
                href={`/${lang}/tours`}
                className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-primary-50 rounded-2xl transition-all duration-200 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                {dict?.nav?.tours || 'Explore Tours'}
              </Link>
            </div>

            {/* Switchers Section */}
            <div className="px-4 py-4 border-t border-gray-50 flex flex-col gap-3">
              <CurrencySwitcher mobile />
              <LanguageSwitcher mobile />
            </div>

            {/* Logout Section (No profile info as requested) */}
            <div className="px-3 py-3 border-t border-gray-50">
              {user ? (
                <button
                  onClick={async () => {
                    // scope: 'local' = clear only this browser's session; do not revoke refresh token (other browsers stay logged in)
                    await supabase.auth.signOut({ scope: 'local' });
                    setIsMenuOpen(false);
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 font-bold group"
                >
                  <span className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Logout
                </button>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className="block w-full px-4 py-3 bg-primary-600 text-white rounded-2xl font-bold text-center shadow-lg shadow-primary-200 active:scale-95 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

