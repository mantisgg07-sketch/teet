'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        returningCustomers: 0,
        totalBookings: 0,
        confirmedRate: 0,
        customers: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            // In a real app, we'd have a dedicated analytics API. 
            // Here we'll process raw bookings data client-side for simplicity.
            const response = await fetch('/api/bookings')
            if (response.ok) {
                const data = await response.json()
                const bookings = data.bookings || []

                // Process data
                const uniqueEmails = new Set(bookings.map(b => b.email))
                const totalBookings = bookings.length
                const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length

                // Group by email to find returning customers
                const customerMap = {}
                bookings.forEach(b => {
                    if (!customerMap[b.email]) {
                        customerMap[b.email] = {
                            email: b.email,
                            name: b.name,
                            phone: b.phone,
                            id: b.user_id, // Capture user_id
                            bookings: 0,
                            lastBooking: null,
                            isRegistered: !!b.user_id
                        }
                    }
                    customerMap[b.email].bookings += 1
                    // Track simple last booking date (assuming desc sort from API)
                    if (!customerMap[b.email].lastBooking) {
                        customerMap[b.email].lastBooking = b.created_at
                    }
                })

                const customers = Object.values(customerMap).sort((a, b) => b.bookings - a.bookings)
                const returningCount = customers.filter(c => c.bookings > 1).length

                setStats({
                    totalCustomers: uniqueEmails.size,
                    returningCustomers: returningCount,
                    totalBookings,
                    confirmedRate: totalBookings ? Math.round((confirmedBookings / totalBookings) * 100) : 0,
                    customers
                })
            }
        } catch (err) {
            console.error('Error fetching analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                        Customers
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Manage your customers and view their booking history.
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="px-8 py-3.5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary-600 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
                >
                    Refresh
                </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Customers</div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalCustomers}</div>
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Total</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary-100 transition-all duration-300">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Returning Customers</div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-black text-primary-600 tracking-tighter">{stats.returningCustomers}</div>
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Customers</div>
                    </div>
                    <div className="mt-4 px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block">
                        {stats.totalCustomers ? Math.round((stats.returningCustomers / stats.totalCustomers) * 100) : 0}% retention
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Bookings</div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalBookings}</div>
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Total</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-100 transition-all duration-300">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Completion Rate</div>
                    <div className="flex items-end gap-2 text-green-600">
                        <div className="text-4xl font-black tracking-tighter">{stats.confirmedRate}%</div>
                        <div className="text-xs font-black mb-1 uppercase tracking-widest opacity-60">Verified</div>
                    </div>
                </div>
            </div>

            {/* Customer List Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">All Customers</h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">List of all customers who have booked tours</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">Loading customers...</div>
                    ) : stats.customers.length === 0 ? (
                        <div className="py-20 text-center grayscale opacity-40 uppercase font-black text-xl tracking-tighter">No customers found</div>
                    ) : (
                        stats.customers.map((customer, index) => (
                            <div
                                key={index}
                                className="px-8 py-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                onClick={() => window.location.href = `/admin/customers/${customer.isRegistered && customer.id ? customer.id : customer.id || customer.email}`}
                            >
                                {/* Avatar / Index */}
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-lg font-black text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    {index + 1}
                                </div>

                                {/* Name & Contact */}
                                <div className="flex-1 min-w-0 w-full md:w-auto text-center md:text-left">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-primary-600 transition-colors truncate">
                                        {customer.name}
                                    </h3>
                                    <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-3 mt-1 text-sm font-medium text-gray-500">
                                        <span className="truncate">{customer.email}</span>
                                        {customer.phone && (
                                            <>
                                                <span className="text-gray-200 hidden md:block">|</span>
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{customer.phone}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Badge */}
                                <div className="flex flex-row md:flex-col gap-2 md:gap-1 items-center md:items-end min-w-[120px]">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest md:mb-1">Bookings</div>
                                    <span className={`px-4 py-1 rounded-xl text-xs font-black tracking-tighter ${customer.bookings > 1 ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {customer.bookings} <span className="text-[9px] uppercase tracking-widest ml-1 font-bold">Orders</span>
                                    </span>
                                </div>

                                {/* Status Section */}
                                <div className="flex flex-row md:flex-col gap-2 md:gap-1 items-center md:items-end min-w-[120px]">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest md:mb-1">Last Activity</div>
                                    <div className="text-sm font-black text-gray-700 uppercase tracking-tighter">
                                        {new Date(customer.lastBooking).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div className="flex items-center min-w-[100px] justify-center md:justify-end">
                                    {customer.isRegistered ? (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Verified</span>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] border-2 border-dashed border-gray-100 px-3 py-1 rounded-xl">
                                            Guest
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
