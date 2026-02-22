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
              className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100/50 rounded-xl transition-all duration-300 z-[70]"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 items-center justify-center">
                <span
                  className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Side Drawer */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-4/5 max-w-[320px] bg-white shadow-2xl z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <Link href={`/${lang}`} onClick={() => setIsMenuOpen(false)} className="block">
              <Image
                src="/img/logo.png"
                alt="GoHoliday Logo"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex-grow overflow-y-auto px-4 py-6 scrollbar-hide">
            {/* Navigation Section */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Explore</p>
              <Link
                href={`/${lang}/tours`}
                className="flex items-center gap-4 px-4 py-4 text-gray-900 hover:bg-primary-50 active:bg-primary-100 rounded-2xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="font-bold text-lg">{dict?.nav?.tours || 'Explore Tours'}</span>
              </Link>
            </div>

            {/* Switchers Section */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Settings</p>
              <div className="space-y-4 px-2">
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <CurrencySwitcher mobile />
                </div>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <LanguageSwitcher mobile />
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="mt-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Account</p>
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={`/${lang}/profile`}
                    className="flex items-center gap-4 px-4 py-4 text-gray-900 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 border border-primary-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut({ scope: 'local' });
                      setIsMenuOpen(false);
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 font-bold group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3v1" />
                      </svg>
                    </div>
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className="block w-full px-4 py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-bold text-center shadow-lg shadow-primary-200 active:scale-[0.98] transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-6 text-center">
            <p className="text-gray-400 text-[10px]">&copy; 2026 GoHoliday. Built with ❤️</p>
          </div>
        </div>
      </div>
    </header>

  )
}

