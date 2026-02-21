'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AdminHeader({ title, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Quick Search - Placeholder */}
                <div className="hidden md:flex relative group">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-600 transition-all text-sm font-medium outline-none w-64"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Profile Avatar / Quick Actions */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-gray-900 uppercase tracking-widest">Admin User</div>
                        <div className="text-[10px] text-primary-600 font-bold uppercase">Super Admin</div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-600/10 active:scale-95 transition-transform cursor-pointer">
                        A
                    </div>
                </div>
            </div>
        </header>
    )
}
