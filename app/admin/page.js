'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Redirect if already logged in via iron-session
  useEffect(() => {
    fetch('/api/customers') // Any protected API to check session
      .then(res => {
        if (res.ok) router.push('/admin/dashboard')
      })
      .catch(() => { })
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // FORCE full page reload to ensure iron-session cookie is correctly
        // picked up by the middleware and server components instantly.
        window.location.href = '/admin/dashboard'
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-900"></div>
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[60%] bg-gray-50 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[60%] bg-primary-50 rounded-full blur-[120px] opacity-30"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-10 md:p-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gray-900 rounded-[2rem] shadow-2xl">
                <Image
                  src="/img/logo.png"
                  alt="GoHoliday Logo"
                  width={120}
                  height={50}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
              Admin <span className="text-primary-600">Portal</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">
              Secure Management Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary-600 transition-colors">
                  System ID / Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                    placeholder="admin@goholiday.com"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary-600 transition-colors">
                  Access Key
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 pr-14 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authorizing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Begin Session
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-loose">
              System Environment V2.0<br />
              Protected by GHoliday Security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
