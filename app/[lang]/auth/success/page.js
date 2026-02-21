'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/lib/i18n'
import { broadcastAuthEvent } from '@/lib/useAuthSync'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AuthSuccessPage() {
  const [dict, setDict] = useState(null)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const type = searchParams.get('type') || 'email_verified'

  // Extract lang from pathname
  const lang = pathname?.split('/')[1] || 'en'

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  // Broadcast auth event to other tabs in the same browser
  useEffect(() => {
    if (type === 'email_updated' || type === 'email_verified') {
      broadcastAuthEvent(type)
    }
  }, [type])

  // Determine message and icon based on type
  const getSuccessContent = () => {
    switch (type) {
      case 'email_verified':
        return {
          title: dict?.authSuccess?.emailVerifiedTitle || 'Email Verified!',
          message: dict?.authSuccess?.emailVerifiedMessage || 'Your email has been successfully verified. You can now access all features.',
          icon: (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          showLogin: true
        }
      case 'email_updated':
        return {
          title: dict?.authSuccess?.emailUpdatedTitle || 'Email Confirmation Processed',
          message: dict?.authSuccess?.emailUpdatedMessage || 'Your email confirmation has been processed. Note: For security, Supabase requires you to click the link sent to BOTH your old and new email addresses before the change is fully applied.',
          icon: (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          showLogin: false
        }
      case 'password_reset':
        return {
          title: dict?.authSuccess?.passwordResetTitle || 'Password Reset!',
          message: dict?.authSuccess?.passwordResetMessage || 'Your password has been successfully reset. You can now log in with your new password.',
          icon: (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          showLogin: true
        }
      default:
        return {
          title: dict?.authSuccess?.successTitle || 'Success!',
          message: dict?.authSuccess?.successMessage || 'Your action was completed successfully.',
          icon: (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          showLogin: false
        }
    }
  }

  const content = getSuccessContent()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-glass p-8">
              {/* Logo */}
              <div className="text-center mb-6">
                <Image
                  src="/img/logo.png"
                  alt="GoHoliday Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto mx-auto mb-4"
                />
              </div>

              {/* Success Icon */}
              <div className="mb-6">
                {content.icon}
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {content.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {content.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {content.showLogin ? (
                  <Link
                    href={`/${lang}/login`}
                    className="block w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition text-center"
                  >
                    {dict?.authSuccess?.goToLogin || 'Go to Login'}
                  </Link>
                ) : (
                  <Link
                    href={`/${lang}/profile`}
                    className="block w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition text-center"
                  >
                    {dict?.authSuccess?.goToProfile || 'Go to Profile'}
                  </Link>
                )}

                <Link
                  href={`/${lang}`}
                  className="block w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
                >
                  {dict?.authSuccess?.goToHome || 'Go to Home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
