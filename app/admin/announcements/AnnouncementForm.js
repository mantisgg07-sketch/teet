'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

export default function AnnouncementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [type, setType] = useState('banner')
  const [popupType, setPopupType] = useState('general')
  const [imageUrl, setImageUrl] = useState('')

  // Discount fields
  const [tours, setTours] = useState([])
  const [toursLoading, setToursLoading] = useState(false)
  const [discountTourId, setDiscountTourId] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')

  // Fetch tours when discount popup type is selected
  useEffect(() => {
    if (type === 'popup' && popupType === 'discount' && tours.length === 0) {
      setToursLoading(true)
      fetch('/api/tours/list')
        .then(res => res.json())
        .then(data => setTours(Array.isArray(data) ? data : []))
        .catch(() => setTours([]))
        .finally(() => setToursLoading(false))
    }
  }, [type, popupType, tours.length])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!message.trim()) {
        setError('Message is required')
        setLoading(false)
        return
      }

      // Validate discount fields
      if (type === 'popup' && popupType === 'discount') {
        if (!discountTourId) {
          setError('Please select a tour package for the discount')
          setLoading(false)
          return
        }
        if (!discountPercentage || discountPercentage < 1 || discountPercentage > 99) {
          setError('Discount must be between 1% and 99%')
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          is_active: isActive,
          type,
          popup_type: type === 'popup' ? popupType : null,
          image_url: type === 'popup' ? imageUrl : null,
          discount_tour_id: type === 'popup' && popupType === 'discount' ? discountTourId : null,
          discount_percentage: type === 'popup' && popupType === 'discount' ? discountPercentage : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Announcement created successfully!')
        setMessage('')
        setIsActive(false)
        setType('banner')
        setPopupType('general')
        setImageUrl('')
        setDiscountTourId('')
        setDiscountPercentage('')
        router.refresh()
      } else {
        setError(data.error || 'Failed to create announcement')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl pro-card rounded-[2rem] p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Add Alert</h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Post a new announcement</p>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-8 animate-shake">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-8 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="message" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-indigo-600 transition-colors">
            Alert Text *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none resize-none shadow-inner"
            placeholder="Type your alert here..."
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Display Mode *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('banner')}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                    ${type === 'banner' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              Banner
            </button>
            <button
              type="button"
              onClick={() => setType('popup')}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                    ${type === 'popup' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 11v3.159c0 .538-.214 1.055-.595 1.436L6 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Popup
            </button>
          </div>
        </div>

        {type === 'popup' && (
          <div className="animate-fade-in">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Popup Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPopupType('discount')}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                      ${popupType === 'discount' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Discount
              </button>
              <button
                type="button"
                onClick={() => setPopupType('new_feature')}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                      ${popupType === 'new_feature' ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                New Feature
              </button>
              <button
                type="button"
                onClick={() => setPopupType('system_update')}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                      ${popupType === 'system_update' ? 'bg-slate-700 border-slate-700 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                System Update
              </button>
              <button
                type="button"
                onClick={() => setPopupType('general')}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest
                      ${popupType === 'general' ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                General
              </button>
            </div>
          </div>
        )}

        {/* Discount Tour Picker — shown when popup_type is discount */}
        {type === 'popup' && popupType === 'discount' && (
          <div className="animate-fade-in space-y-5">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                Select Tour Package *
              </label>
              {toursLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                  Loading tours...
                </div>
              ) : tours.length === 0 ? (
                <p className="text-sm text-slate-400 py-3">No tours found. Create a tour first.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {tours.map(tour => (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => {
                        setDiscountTourId(tour.id)
                        if (tour.is_discount_active && tour.discount_percentage) {
                          setDiscountPercentage(tour.discount_percentage.toString())
                        } else {
                          setDiscountPercentage('')
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-3
                        ${discountTourId === tour.id
                          ? 'bg-amber-50 border-amber-400 shadow-sm'
                          : 'bg-white border-slate-100 hover:border-amber-200'}`}
                    >
                      <div className="min-w-0">
                        <div className={`text-sm font-bold truncate ${discountTourId === tour.id ? 'text-amber-700' : 'text-slate-700'}`}>
                          {tour.title_en || tour.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">
                          {tour.location_en || tour.location} &middot; {tour.currency || 'USD'} {tour.price}
                        </div>
                      </div>
                      {discountTourId === tour.id && (
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="discountPct" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                Discount Percentage *
              </label>
              <div className="relative">
                <input
                  id="discountPct"
                  type="number"
                  min="1"
                  max="99"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-500 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner pr-12"
                  placeholder="e.g. 20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-500">%</span>
              </div>
              {discountPercentage && discountTourId && (
                <div className="mt-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-700">
                    {(() => {
                      const selectedTour = tours.find(t => t.id === discountTourId)
                      if (!selectedTour) return ''
                      const original = selectedTour.price
                      const discounted = original * (1 - discountPercentage / 100)
                      return `${selectedTour.currency || 'USD'} ${original.toFixed(0)} → ${selectedTour.currency || 'USD'} ${discounted.toFixed(0)} (${discountPercentage}% off)`
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Popup Image Upload */}
        {type === 'popup' && (
          <div className="animate-fade-in">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Visual Asset
            </label>
            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
              <ImageUpload
                images={imageUrl ? [imageUrl] : []}
                onUpload={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl('')}
                isBanner={true}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-[4px] left-[4px] h-5 w-5 bg-white rounded-full border border-slate-300 transition-transform duration-200 ${isActive ? 'translate-x-5 border-white' : ''}`} />
          </button>
          <span
            onClick={() => setIsActive(!isActive)}
            className="text-[9px] font-black text-slate-900 uppercase tracking-widest cursor-pointer select-none"
          >
            Activate Now
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-[0.3em] disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 active:scale-[0.98] group flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          )}
          {loading ? 'Saving...' : 'Save Announcement'}
        </button>
      </form>
    </div>
  )
}
