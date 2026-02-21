'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Tours</Link>
            <span>/</span>
            <span className="text-gray-900">New Deployment</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
            Architect <span className="text-primary-600">Experience</span>
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Technical Specifications</h2>
        </div>

        <div className="p-8 md:p-12">
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
            <div className="space-y-8">
              <div className="group">
                <label htmlFor="title" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                  Project Designation (Title) *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                  placeholder="e.g. ULTRA-PREMIUM MALDIVES ESCAPE"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="price" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
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
                      className="w-full pl-6 pr-16 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                      placeholder="0.00"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                      {formData.currency}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="currency" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                    Fiduciary Unit *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none cursor-pointer appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="THB">THB - Thai Baht</option>
                    <option value="NPR">NPR - Nepali Rupee</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                  Operational Details (Description) *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none resize-none"
                  placeholder="Outline the full experience scope..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="duration" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                    Temporal Window (Duration) *
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                    placeholder="e.g. 7 DAYS / 6 NIGHTS"
                  />
                </div>

                <div className="group">
                  <label htmlFor="dates" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                    Availability Cycles *
                  </label>
                  <input
                    id="dates"
                    name="dates"
                    type="text"
                    value={formData.dates}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                    placeholder="e.g. Q3 2026, SELECT DATES"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="location" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-600 transition-colors">
                  Geographical Coordinates (Location) *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900 outline-none"
                  placeholder="e.g. MALE, MALDIVES"
                />
              </div>
            </div>

            <div className="space-y-12 pt-12 border-t border-gray-50">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">
                  Primary Visual (Banner)
                </label>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <ImageUpload
                    images={bannerImage ? [bannerImage] : []}
                    onUpload={handleBannerUpload}
                    onRemove={handleBannerRemove}
                    isBanner={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">
                  Experience Gallery
                </label>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <ImageUpload
                    images={galleryImages}
                    onUpload={handleGalleryUpload}
                    onRemove={handleGalleryRemove}
                    isBanner={false}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">
                  Cinematic Assets (Video)
                </label>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <VideoUpload
                    videos={videoUrls}
                    onUpload={handleVideoUpload}
                    onRemove={handleVideoRemove}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-gray-50">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] group flex items-center justify-center gap-3"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                )}
                {loading ? 'Initializing...' : 'Authorize Deployment'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98]"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
