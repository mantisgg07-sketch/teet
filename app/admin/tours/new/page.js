'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import VideoUpload from '@/components/VideoUpload'

export default function NewTourPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    duration: '',
    dates: '',
    location: '',
  })

  const [bannerImage, setBannerImage] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [videoUrls, setVideoUrls] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBannerUpload = (url) => {
    setBannerImage(url)
  }

  const handleBannerRemove = () => {
    setBannerImage('')
  }

  const handleGalleryUpload = (url) => {
    setGalleryImages(prev => [...prev, url])
  }

  const handleGalleryRemove = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleVideoUpload = (url) => {
    setVideoUrls(prev => [...prev, url])
  }

  const handleVideoRemove = (index) => {
    setVideoUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.price ||
        !formData.duration || !formData.dates || !formData.location) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/tours/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          banner_image: bannerImage,
          image_urls: JSON.stringify(galleryImages),
          video_urls: JSON.stringify(videoUrls),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Tour created successfully!')
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 1500)
      } else {
        setError(data.error || 'Failed to create tour')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors">Tours</Link>
            <span className="opacity-40">/</span>
            <span className="text-slate-900">Provisioning</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
            Create New <span className="text-indigo-600">Listing</span>
          </h1>
        </div>
      </div>

      <div className="pro-card rounded-[2rem] overflow-hidden border-slate-100">
        <div className="px-6 md:px-10 py-5 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">Inventory Configuration</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define core listing parameters</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-10 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-10 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="title" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Title Archive *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner"
                  placeholder="e.g. ULTRA-PREMIUM MALDIVES ESCAPE"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="price" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Base Valuation *
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner"
                      placeholder="0.00"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {formData.currency}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="currency" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Currency Unit *
                  </label>
                  <div className="relative">
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none cursor-pointer appearance-none shadow-inner"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="THB">THB - Thai Baht</option>
                      <option value="NPR">NPR - Nepali Rupee</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Narrative Brief *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none resize-none shadow-inner"
                  placeholder="Outline the full tour details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="duration" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Timeframe *
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner"
                    placeholder="e.g. 7 DAYS / 6 NIGHTS"
                  />
                </div>

                <div className="group">
                  <label htmlFor="dates" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Deployment Window *
                  </label>
                  <input
                    id="dates"
                    name="dates"
                    type="text"
                    value={formData.dates}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner"
                    placeholder="e.g. Q3 2026, SELECT DATES"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="location" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Operational Hub *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm outline-none shadow-inner"
                  placeholder="e.g. MALE, MALDIVES"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
              <div className="md:col-span-2">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Visual Intelligence</h3>
              </div>

              <div className="pro-card p-6 md:p-8 rounded-2xl border-slate-100">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  Primary Asset (Banner)
                </label>
                <ImageUpload
                  images={bannerImage ? [bannerImage] : []}
                  onUpload={handleBannerUpload}
                  onRemove={handleBannerRemove}
                  isBanner={true}
                />
              </div>

              <div className="pro-card p-6 md:p-8 rounded-2xl border-slate-100">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  Exhibition Gallery
                </label>
                <ImageUpload
                  images={galleryImages}
                  onUpload={handleGalleryUpload}
                  onRemove={handleGalleryRemove}
                  isBanner={false}
                />
              </div>

              <div className="md:col-span-2 pro-card p-6 md:p-8 rounded-2xl border-slate-100">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  Motion Media (Video)
                </label>
                <VideoUpload
                  videos={videoUrls}
                  onUpload={handleVideoUpload}
                  onRemove={handleVideoRemove}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-[0.2em] disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 active:scale-[0.98] group flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                )}
                {loading ? 'Processing...' : 'Deploy Listing'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
