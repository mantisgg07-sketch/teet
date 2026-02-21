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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                        Booking Orders
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Process and track your customer requests.
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="px-8 py-3.5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary-600 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
                >
                    Refresh Sync
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
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-10">
                    <div className="px-8 py-6 border-b border-gray-50">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-fit">Filter by</span>
                                <div className="flex flex-wrap gap-2">
                                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full lg:w-96">
                                <input
                                    type="text"
                                    placeholder="Search by ID, Name or Email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary-600 transition-all font-bold text-sm tracking-tight outline-none"
                                />
                                <svg className="w-5 h-5 text-gray-300 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                                <div key={booking.id} className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50/50 transition-colors group">
                                    {/* ID & Date */}
                                    <div className="flex-shrink-0 w-full md:w-32">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Ref</div>
                                        <div className="text-lg font-black text-gray-900 tracking-tighter group-hover:text-primary-600 transition-colors">#{booking.id}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase">{new Date(booking.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="flex-1 min-w-0 w-full md:w-auto">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Link href={`/admin/bookings/${booking.id}`} className="block truncate">
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-primary-600 transition-colors">
                                                    {booking.name}
                                                </h3>
                                            </Link>
                                            {booking.user_id && (
                                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Registered User"></span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-gray-500">
                                            <span className="truncate">{booking.email}</span>
                                            <span className="text-gray-300">/</span>
                                            <span className="text-primary-600 font-bold uppercase text-[10px] tracking-widest">Tour #{booking.tour_id}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex-shrink-0 w-full md:w-32 text-center md:text-left">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stage</div>
                                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex-shrink-0 w-full md:w-auto flex flex-wrap md:flex-nowrap gap-2 justify-center">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-green-600/10 active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    className="px-5 py-2.5 bg-white border-2 border-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition active:scale-95"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                className="px-5 py-2.5 bg-white border-2 border-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition active:scale-95"
                                            >
                                                Cancel order
                                            </button>
                                        )}
                                        {booking.status === 'cancelled' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'pending')}
                                                className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition active:scale-95"
                                            >
                                                Restart
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/bookings/${booking.id}`}
                                            className="px-5 py-2.5 bg-gray-50 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition active:scale-95 flex items-center justify-center font-black"
                                        >
                                            View Full details
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
