'use client'

import { useState } from 'react'
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
  const [imageUrl, setImageUrl] = useState('')

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

      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          is_active: isActive,
          type,
          image_url: type === 'popup' ? imageUrl : null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Announcement created successfully!')
        setMessage('')
        setIsActive(false)
        setType('banner')
        setImageUrl('')
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
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">New Broadcast</h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deploy system-wide signals</p>
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
            Broadcast Content *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none resize-none shadow-inner"
            placeholder="Type your system announcement here..."
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
              Overlay
            </button>
          </div>
        </div>

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
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
          </div>
          <label htmlFor="isActive" className="text-[9px] font-black text-slate-900 uppercase tracking-widest cursor-pointer select-none">
            Deploy Live Immediately
          </label>
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
          {loading ? 'Deploying...' : 'Authorize Broadcast'}
        </button>
      </form>
    </div>
  )
}
