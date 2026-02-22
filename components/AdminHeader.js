'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AdminHeader({ title, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 glass-morphism border-b px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors border border-transparent active:border-slate-200 shadow-sm sm:shadow-none"
                >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Quick Search - Sleeker Profile */}
                <div className="hidden md:flex relative group">
                    <input
                        type="text"
                        placeholder="Jump to..."
                        className="pl-9 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-600 transition-all text-xs font-bold outline-none w-48 focus:w-64"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Profile Avatar / Quick Actions */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100 h-8">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Admin</div>
                        <div className="text-[8px] text-indigo-500 font-bold uppercase tracking-tighter mt-0.5">Control Mode</div>
                    </div>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform cursor-pointer border border-white/20">
                        A
                    </div>
                </div>
            </div>
        </header>
    )
}
