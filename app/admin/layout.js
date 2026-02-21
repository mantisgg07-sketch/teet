'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    // Define page titles based on pathname
    const getPageTitle = (path) => {
        if (path.includes('/dashboard')) return 'Dashboard Overview'
        if (path.includes('/bookings')) return 'Manage Bookings'
        if (path.includes('/customers')) return 'Customer Analytics'
        if (path.includes('/tours')) return 'Tour Management'
        if (path.includes('/announcements')) return 'Announcements'
        return 'Admin Panel'
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop & Mobile Drawer */}
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                currentPath={pathname}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    title={getPageTitle(pathname)}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-x-hidden p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}
