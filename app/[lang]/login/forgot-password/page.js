import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [dict, setDict] = useState(null)
  const pathname = usePathname()

  // Extract lang from pathname
  const lang = pathname?.split('/')[1] || 'en'

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!supabase) {
      setError(dict?.reviews?.errorConfig || 'Supabase is not configured.')
      setLoading(false)
      return
    }

    try {
      // 1. Check if email exists in public.profiles first (Case-insensitive check)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', email.trim())
        .maybeSingle();

      if (profileError || !profile) {
        setError(dict?.forgotPassword?.errorNotFound || 'No account found with this email address. Please check your spelling or sign up.');
        setLoading(false);
        return;
      }

      // 2. Use environment variable for base URL if available, otherwise fallback to window.location.origin
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${baseUrl}/${lang}/login/update-password`,
      })

      if (error) throw error

      setMessage(dict?.forgotPassword?.successMessage || 'Password reset email sent! Please check your inbox and follow the link to reset your password.')
      setEmail('')
    } catch (error) {
      setError(error.message)
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
                    onChange={(e) => setEmail(e.target.value)}
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

              {/* Back to Home */}
              <div className="mt-4 text-center">
                <Link href={`/${lang}`} className="text-gray-600 hover:text-gray-800 text-sm">
                  ← {dict.forgotPassword.backToHome}
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
