'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AnnouncementList({ announcements }) {
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState(null)

  const handleToggleActive = async (id, currentStatus) => {
    setActionLoading(id)
    try {
      const response = await fetch('/api/announcements/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to toggle announcement status')
      }
    } catch (error) {
      console.error('Toggle error:', error)
      alert('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id, message) => {
    if (!confirm(`Are you sure you want to delete this announcement?\n\n"${message}"`)) {
      return
    }

    setActionLoading(id)
    try {
      const response = await fetch('/api/announcements/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No announcements yet. Create your first announcement above.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
            <tr>
              <th className="px-6 py-5">Announcement</th>
              <th className="px-6 py-5">Type</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-6">
                  <div className="text-sm font-black text-gray-900 leading-relaxed max-w-md">
                    {announcement.message_en || announcement.message}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit
                    ${announcement.type === 'popup'
                      ? 'bg-purple-50 text-purple-600 border border-purple-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                    {announcement.type === 'popup' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 11v3.159c0 .538-.214 1.055-.595 1.436L6 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                    )}
                    {announcement.type}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                    ${announcement.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                    {announcement.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-6 border-l border-transparent group-hover:border-gray-100 transition-colors">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                      disabled={actionLoading === announcement.id}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${announcement.is_active
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20'}`}
                    >
                      {actionLoading === announcement.id ? '...' : announcement.is_active ? 'Stop' : 'Start'}
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id, announcement.message_en || announcement.message)}
                      disabled={actionLoading === announcement.id}
                      className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                    ${announcement.type === 'popup'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-blue-50 text-blue-600'
                  }`}>
                  {announcement.type}
                </span>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm font-black text-gray-900 leading-relaxed">{announcement.message_en || announcement.message}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                disabled={actionLoading === announcement.id}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${announcement.is_active
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-primary-600 text-white shadow-lg'}`}
              >
                {actionLoading === announcement.id ? 'Processing...' : announcement.is_active ? 'Deactivate' : 'Activate Live'}
              </button>
              <button
                onClick={() => handleDelete(announcement.id, announcement.message_en || announcement.message)}
                disabled={actionLoading === announcement.id}
                className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
