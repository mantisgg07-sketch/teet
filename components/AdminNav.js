'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminNav() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-secondary-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/img/logo.png"
              alt="GoHoliday Admin"
              width={74}
              height={32}
              className="h-8 w-auto hover:opacity-90 transition"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin/dashboard"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/bookings"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Bookings
            </Link>
            <Link
              href="/admin/customers"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Customers
            </Link>
            <Link
              href="/admin/tours/new"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Add Tour
            </Link>
            <Link
              href="/admin/announcements"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Announcements
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition font-medium shadow-md"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-700">
            <div className="flex flex-col space-y-3">
              <Link
                href="/admin/dashboard"
                className="text-gray-300 hover:text-white hover:bg-secondary-800 transition font-medium px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/bookings"
                className="text-gray-300 hover:text-white hover:bg-secondary-800 transition font-medium px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bookings
              </Link>
              <Link
                href="/admin/customers"
                className="text-gray-300 hover:text-white hover:bg-secondary-800 transition font-medium px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customers
              </Link>
              <Link
                href="/admin/tours/new"
                className="text-gray-300 hover:text-white hover:bg-secondary-800 transition font-medium px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Tour
              </Link>
              <Link
                href="/admin/announcements"
                className="text-gray-300 hover:text-white hover:bg-secondary-800 transition font-medium px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Announcements
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="text-left px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition font-medium shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
