'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [dict, setDict] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Extract lang from pathname
  const lang = pathname?.split('/')[1] || 'en'

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(`/${lang}`)
    }
  }, [user, authLoading, router, lang])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
    if (message) setMessage('')
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (attempts >= 2) {
      setError(dict?.errors?.rateLimitExceeded || 'Too many attempts. Please wait a few minutes before trying again.');
      setLoading(false);
      return;
    }

    try {
      setAttempts(prev => prev + 1);
      const trimmedEmail = email.trim();

      // Determine redirect URL
      const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || ''
      const redirectTo = `${origin}/auth/callback?type=recovery&lang=${lang}`

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          redirectTo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Known errors, or rate limits
        if (data.error?.toLowerCase().includes('rate limit')) {
          setError(dict?.errors?.rateLimitExceeded || 'Too many attempts. Please try again later.');
        } else {
          setError(data.error || 'Account not found or verification error.');
        }
        return;
      }

      setMessage(dict?.forgotPassword?.successMessage || data.message || 'Reset link has been sent to email.');
      setEmail('')
    } catch (err) {
      console.error('[ForgotPassword] UNEXPECTED EXCEPTION:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!dict) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} dict={dict} />

      <main className="flex-grow bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {dict.forgotPassword.title}
                </h1>
                <p className="text-gray-600">
                  {dict.forgotPassword.subtitle}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.forgotPassword.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={dict.forgotPassword.emailPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? dict.forgotPassword.sending : dict.forgotPassword.sendButton}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link href={`/${lang}/login`} className="text-primary-600 hover:text-primary-700 font-medium">
                  ← {dict.forgotPassword.backToLogin}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
