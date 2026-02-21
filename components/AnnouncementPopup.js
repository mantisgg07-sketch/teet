'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AnnouncementPopup({ announcement }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this announcement
    const dismissedId = localStorage.getItem('dismissedAnnouncementId')
    const dismissedAt = localStorage.getItem('dismissedAnnouncementAt')

    // Show popup if:
    // 1. Never dismissed OR
    // 2. Dismissed more than 24 hours ago OR
    // 3. Different announcement ID
    const shouldShow =
      !dismissedId ||
      dismissedId !== String(announcement.id) ||
      (dismissedAt && Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000)

    if (shouldShow) {
      // Small delay before showing to ensure page is loaded
      setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 500)
    }
  }, [announcement.id])

  const handleDismiss = () => {
    setIsAnimating(false)

    // Store dismissal in localStorage
    localStorage.setItem('dismissedAnnouncementId', String(announcement.id))
    localStorage.setItem('dismissedAnnouncementAt', String(Date.now()))

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
    >
      {/* Premium Backdrop - Glassmorphism */}
      <div
        className={`absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-700 ${isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleDismiss}
        aria-hidden="true"
      ></div>

      {/* Modal Content - High Contrast Dark Theme */}
      <div
        className={`relative bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden transform transition-all duration-500 ease-out border border-gray-100 ${isAnimating ? 'translate-y-0 scale-100 rotate-0' : 'translate-y-12 scale-90 rotate-1'
          }`}
      >
        {/* Visual Narrative Section */}
        {announcement.image_url && (
          <div className="relative w-full h-56 sm:h-72">
            <Image
              src={announcement.image_url}
              alt="Official Broadcast Asset"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-8 sm:p-12">
          {/* Close Button - Discrete & Elegant */}
          <button
            onClick={handleDismiss}
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none group z-20"
            aria-label="Dismiss official broadcast"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Core Message */}
          <div className="text-center">
            <h2
              id="announcement-title"
              className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-[1.1] uppercase tracking-tighter"
            >
              System <span className="text-primary-600">Update</span>
            </h2>
            <div className="h-1 w-12 bg-primary-600 mx-auto rounded-full mb-8"></div>
            <p className="text-base sm:text-lg font-bold text-gray-500 leading-relaxed mb-10 px-2 uppercase tracking-wide">
              {announcement.message}
            </p>
          </div>

          {/* Acknowledge Action */}
          <button
            onClick={handleDismiss}
            className="w-full py-5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Acknowledge & Sync
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>

        </div>
      </div>
    </div>
  )
}
