'use client'

import { useState } from 'react'

export default function AnnouncementBanner({ message }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible || !message) {
    return null
  }

  return (
    <div
      className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 border-b border-white/10 relative z-40 overflow-hidden shadow-[0_4px_20px_-5px_rgba(30,64,175,0.3)]"
      role="alert"
      aria-live="polite"
    >
      {/* Subtle glassmorphism and animated glow */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
      <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_180deg,transparent_360deg)] animate-[spin_8s_linear_infinite]"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between py-2 md:py-2.5 gap-6">

          {/* Message Group */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Megaphone Icon with Glow */}
            <div className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-inner">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>

            {/* Primary Message */}
            <p className="text-xs md:text-sm font-black text-white tracking-wide leading-relaxed truncate group">
              <span className="text-blue-100/60 mr-2 uppercase tracking-widest text-[9px] font-black">Latest Update:</span>
              {message}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDismiss}
              className="group flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 shadow-md active:scale-95"
              aria-label="Dismiss announcement"
            >
              <span className="text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-[0.15em] transition-colors">Dismiss</span>
              <svg
                className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-all transform group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic top accent line for premium feel */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  )
}
