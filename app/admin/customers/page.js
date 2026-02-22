'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CustomersPage() {
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                        Customers
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 ml-1">
                        View all customers
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                >
                    Refresh
                </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
                <div className="pro-card rounded-2xl p-5 md:p-8">
                    <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customers</div>
                    <div className="flex items-end gap-1.5 md:gap-2">
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stats.totalCustomers}</div>
                        <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-widest leading-none">Total</div>
                    </div>
                </div>
                <div className="pro-card rounded-2xl p-5 md:p-8">
                    <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Repeat</div>
                    <div className="flex items-end gap-1.5 md:gap-2">
                        <div className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter">{stats.returningCustomers}</div>
                        <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-widest leading-none">Repeat</div>
                    </div>
                </div>
                <div className="pro-card rounded-2xl p-5 md:p-8">
                    <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Orders</div>
                    <div className="flex items-end gap-1.5 md:gap-2">
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stats.totalBookings}</div>
                        <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-widest leading-none">Orders</div>
                    </div>
                </div>
                <div className="pro-card rounded-2xl p-5 md:p-8">
                    <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ratio</div>
                    <div className="flex items-end gap-1.5 md:gap-2 text-green-600">
                        <div className="text-2xl md:text-3xl font-black tracking-tighter">{stats.confirmedRate}%</div>
                        <div className="text-[9px] font-black mb-1 uppercase tracking-widest leading-none opacity-60">Rate</div>
                    </div>
                </div>
            </div>

            {/* Customer List Section */}
            <div className="pro-card rounded-[2rem] overflow-hidden">
                <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">Customer List</h2>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-0.5">All customer data</p>
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
                                className="px-5 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:bg-slate-50/50 transition-colors cursor-pointer group border-b border-slate-50 last:border-0"
                                onClick={() => window.location.href = `/admin/customers/${customer.isRegistered && customer.id ? customer.id : customer.id || customer.email}`}
                            >
                                {/* Avatar / Index */}
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    {index + 1}
                                </div>

                                {/* Name & Contact */}
                                <div className="flex-1 min-w-0 w-full md:w-auto text-center md:text-left">
                                    <h3 className="text-base md:text-xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors truncate">
                                        {customer.name}
                                    </h3>
                                    <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-3 gap-y-1 mt-1 text-[11px] md:text-sm font-bold text-slate-400">
                                        <span className="truncate">{customer.email}</span>
                                        {customer.phone && (
                                            <>
                                                <span className="text-slate-200 hidden md:block">|</span>
                                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">{customer.phone}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* High Density Stats */}
                                <div className="flex items-center gap-4 md:gap-12 w-full md:w-auto py-3 md:py-0 border-y md:border-0 border-slate-50">
                                    <div className="flex-1 md:flex-none flex flex-col items-center md:items-end min-w-[80px]">
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Orders</div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border transition-colors ${customer.bookings > 1 ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            {customer.bookings} <span className="text-[7px] font-bold opacity-60">X</span>
                                        </span>
                                    </div>

                                    <div className="flex-1 md:flex-none flex flex-col items-center md:items-end min-w-[80px]">
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Last Order</div>
                                        <div className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-tighter">
                                            {new Date(customer.lastBooking).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div className="flex items-center min-w-[100px] justify-center md:justify-end">
                                    {customer.isRegistered ? (
                                        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.55)]"></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                                        </div>
                                    ) : (
                                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-dashed border-slate-200 px-3 py-1.5 rounded-lg">
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
