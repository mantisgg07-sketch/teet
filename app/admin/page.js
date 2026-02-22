'use client'

import { useState, useEffect } from 'react'
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
    fetch('/api/admin/session') // Use dedicated session check API
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] z-20"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[80%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(15,23,42,1)_100%)] z-10"></div>

      <div className="max-w-[420px] w-full relative z-20">
        <div className="pro-card rounded-[2.5rem] p-8 md:p-12 border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600/20 group-hover:bg-indigo-600/40 transition-colors"></div>

          <div className="text-center mb-10">
            <div className="flex justify-center mb-10">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl border border-slate-700 group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl font-black italic text-indigo-500">G</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-[32px] font-black text-white mb-1 uppercase tracking-tighter">
              Admin <span className="text-indigo-400">Login</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] ml-1">
              Secure Management Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3.5 rounded-xl text-[11px] font-bold flex items-center gap-3 mb-8 animate-shake">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label htmlFor="email" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors text-center">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:bg-slate-800 focus:border-indigo-500 transition-all font-bold text-white text-center text-sm outline-none shadow-inner"
                    placeholder="admin@terminal.io"
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors text-center">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:bg-slate-800 focus:border-indigo-500 transition-all font-bold text-white text-center text-sm pr-14 outline-none shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-[0.2em] disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Log In
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-loose">
              System Node: ADMIN_v2.5<br />
              <span className="text-indigo-900/40">Encrypted Channel Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
