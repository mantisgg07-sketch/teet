'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header' // Using the main header or we should create an admin header
import Link from 'next/link'

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState('pending')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings')
            if (response.ok) {
                const data = await response.json()
                // Ensure admin_note is included in the booking objects
                setBookings(data.bookings)
            } else {
                setError('Failed to fetch bookings')
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
            setError('An error occurred while fetching bookings')
        } finally {
            setLoading(false)
        }
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
        const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toString().includes(searchTerm)
        return matchesStatus && matchesSearch
    })

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })

            if (response.ok) {
                fetchBookings() // Refresh list
            }
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                        Bookings
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 ml-1">
                        Manage your booking orders
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading bookings...</div>
            ) : error ? (
                <div className="text-red-600 text-center py-12">{error}</div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                    No bookings found yet.
                </div>
            ) : (
                <div className="pro-card rounded-[2rem] overflow-hidden mb-10">
                    <div className="px-5 md:px-8 py-4 md:py-6 border-b border-slate-50 bg-slate-50/20">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-fit">Filter</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full lg:w-80">
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-xs tracking-tight outline-none"
                                />
                                <svg className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50 px-4 md:px-0">
                        {filteredBookings.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="text-6xl mb-6 grayscale opacity-40">🔍</div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">No orders found</h3>
                                <p className="text-gray-500 font-medium tracking-tight">Try adjusting your filters or search term.</p>
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div key={booking.id} className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:bg-slate-50/50 transition-colors group">
                                    {/* ID & Date */}
                                    <div className="flex-shrink-0 w-full md:w-32 border-b md:border-b-0 border-slate-50 pb-3 md:pb-0">
                                        <div className="flex justify-between md:block">
                                            <div>
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Booking ID</div>
                                                <div className="text-sm md:text-base font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">#{booking.id}</div>
                                            </div>
                                            <div className="text-right md:text-left">
                                                <div className="text-[8px] font-bold text-slate-400 uppercase md:hidden">Date</div>
                                                <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mt-0.5 md:mt-1">{new Date(booking.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="flex-1 min-w-0 w-full md:w-auto py-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link href={`/admin/bookings/${booking.id}`} className="block truncate">
                                                <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                                                    {booking.name}
                                                </h3>
                                            </Link>
                                            {booking.user_id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Verified Member"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400">
                                            <span className="truncate max-w-[150px] md:max-w-none">{booking.email}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                            <span className="text-indigo-500 uppercase tracking-widest font-black text-[9px]">Tour #{booking.tour_id}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex-shrink-0 w-full md:w-28 flex md:flex-col justify-between items-center md:items-start border-y md:border-y-0 border-slate-50 py-3 md:py-0">
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest md:mb-1">Status</div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border
                                            ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex-shrink-0 w-full md:w-auto flex gap-1.5 pt-2 md:pt-0">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 active:scale-95"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    className="w-10 h-10 md:w-9 md:h-9 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 group/btn"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </>
                                        )}
                                        {booking.status !== 'pending' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'pending')}
                                                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-slate-400 hover:text-slate-900 transition active:scale-95"
                                            >
                                                Reset
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/bookings/${booking.id}`}
                                            className="w-10 h-10 md:w-9 md:h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
