'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCurrency } from '@/components/CurrencyProvider'

export default function BookingForm({ tourId, tourTitle, basePrice, currency = 'USD', dict, onClose }) {
    const router = useRouter()
    const { convertPrice } = useCurrency()
    const b = dict?.booking || {}

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        guests: 1,
        children: 0,
        contact_method: 'whatsapp',
        message: ''
    })
    const [totalPrice, setTotalPrice] = useState(basePrice)

    // Update total price when guests or children change
    useEffect(() => {
        const adultTotal = formData.guests * basePrice
        const childTotal = formData.children * (basePrice * 0.5)
        setTotalPrice(adultTotal + childTotal)
    }, [formData.guests, formData.children, basePrice])

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (supabase) {
            supabase.auth.getSession().then(async ({ data: { session } }) => {
                if (session?.user) {
                    setUser(session.user)

                    let phone =
                        session.user.phone ||
                        session.user.user_metadata?.phone ||
                        session.user.user_metadata?.phone_number ||
                        session.user.user_metadata?.mobile ||
                        session.user.app_metadata?.phone ||
                        '';

                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('phone_number')
                        .eq('id', session.user.id)
                        .single();

                    if (profileData?.phone_number) {
                        phone = profileData.phone_number;
                    }

                    setFormData(prev => ({
                        ...prev,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                        phone: phone
                    }))
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGuestsChange = (change) => {
        setFormData(prev => {
            const newGuests = Math.max(1, prev.guests + change)
            return { ...prev, guests: newGuests }
        })
    }

    const handleChildrenChange = (change) => {
        setFormData(prev => {
            const newChildren = Math.max(0, prev.children + change)
            return { ...prev, children: newChildren }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tour_id: tourId,
                    user_id: user?.id,
                    total_price: totalPrice,
                    ...formData
                })
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    if (onClose) onClose()
                }, 3000)
            } else {
                setError(data.error || (b.errorMessage || 'Failed to submit booking'))
            }
        } catch (err) {
            setError(b.errorMessage || 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">{b.successTitle || 'Booking Request Sent!'}</h3>
                <p className="text-green-700">{b.successMessage || 'We will contact you shortly via'} {formData.contact_method}.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden relative">

            <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tighter">
                {b.title || 'Book Your Trip'}
            </h2>
            <p className="text-gray-500 mb-8 text-lg font-medium">
                {b.fillDetails || 'Interested in'} <span className="text-primary-600 font-black">"{tourTitle}"</span>
            </p>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-fade-in">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guests Counter Section */}
                <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-200/60 space-y-4">
                    {/* Adults Row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest">{b.adults || 'Adults'}</label>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{b.perPerson || dict?.common?.perPerson || 'per person'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleGuestsChange(-1)}
                                className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                            </button>
                            <span className="text-xl font-black text-gray-900 w-6 text-center">{formData.guests}</span>
                            <button
                                type="button"
                                onClick={() => handleGuestsChange(1)}
                                className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Children Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest">{b.children || 'Children'}</label>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{b.childDiscount || '50% off'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleChildrenChange(-1)}
                                className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                            </button>
                            <span className="text-xl font-black text-gray-900 w-6 text-center">{formData.children}</span>
                            <button
                                type="button"
                                onClick={() => handleChildrenChange(1)}
                                className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">{b.fullName || 'Full Name'}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 transition-all outline-none font-bold text-gray-900 placeholder-gray-300"
                            placeholder={b.fullNamePlaceholder || 'e.g. John Doe'}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">{b.email || 'Email'}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 transition-all outline-none font-bold text-gray-900 placeholder-gray-300"
                                placeholder="name@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">{b.phone || 'Phone'}</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 transition-all outline-none font-bold text-gray-900 placeholder-gray-300"
                                placeholder={b.phonePlaceholder || '+66 00 000 0000'}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">{b.contactMethod || 'Contact via'}</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, contact_method: 'whatsapp' }))}
                            className={`flex-1 group px-4 py-3 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all active:scale-95 ${formData.contact_method === 'whatsapp'
                                ? 'bg-[#25D366] border-[#25D366] text-white shadow-xl shadow-green-600/20'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118 1.157-.175 1.758-.967 1.758-1.761.017-.791-.412-1.558-.809-1.734zM12 21.463C6.794 21.463 2.536 17.205 2.536 12c0-5.204 4.257-9.463 9.463-9.463 5.204 0 9.463 4.257 9.463 9.463 0 5.204-4.257 9.463-9.463 9.463z" />
                            </svg>
                            <span className="font-black text-[10px] uppercase tracking-wider">WhatsApp</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, contact_method: 'email' }))}
                            className={`flex-1 group px-4 py-3 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all active:scale-95 ${formData.contact_method === 'email'
                                ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-600/20'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-black text-[10px] uppercase tracking-wider">{b.emailContact || 'Email'}</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group border border-gray-100">
                    <div className="text-center md:text-left">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{b.totalAmount || 'Total Investment'}</div>
                        <div className="text-3xl font-black text-gray-900 transition-transform origin-left">{convertPrice(totalPrice, currency)}</div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-3.5 bg-primary-600 text-white rounded-xl font-black text-base uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? (b.processing || 'Processing...') : (b.submit || 'Book Now')}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (onClose) {
                            onClose()
                        } else {
                            router.back()
                        }
                    }}
                    className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
                >
                    {dict?.common?.cancel || 'Nevermind, go back'}
                </button>
            </form>
        </div>
    )
}
