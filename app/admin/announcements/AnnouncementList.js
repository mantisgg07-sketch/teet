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
      <div className="hidden md:block overflow-hidden pro-card rounded-2xl">
        <table className="w-full text-left">
          <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
            <tr>
              <th className="px-6 py-4">Alert</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-[13px] font-bold text-slate-900 leading-snug max-w-lg">
                    {announcement.message_en || announcement.message}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit
                      ${announcement.type === 'popup'
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                      {announcement.type}
                    </span>
                    {announcement.type === 'popup' && announcement.popup_type && (
                      <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest w-fit
                        ${announcement.popup_type === 'discount' ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : announcement.popup_type === 'new_feature' ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : announcement.popup_type === 'system_update' ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-indigo-50 text-indigo-500 border border-indigo-100'
                        }`}>
                        {announcement.popup_type === 'new_feature' ? 'new feature' : announcement.popup_type === 'system_update' ? 'sys update' : announcement.popup_type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest
                    ${announcement.is_active
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}>
                    {announcement.is_active ? 'On' : 'Off'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {new Date(announcement.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                      disabled={actionLoading === announcement.id}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all
                        ${announcement.is_active
                          ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700'}`}
                    >
                      {actionLoading === announcement.id ? '...' : announcement.is_active ? 'Stop' : 'Start'}
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id, announcement.message_en || announcement.message)}
                      disabled={actionLoading === announcement.id}
                      className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="pro-card rounded-2xl p-5">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest
                      ${announcement.type === 'popup'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-50 text-slate-600'
                    }`}>
                    {announcement.type}
                  </span>
                  {announcement.type === 'popup' && announcement.popup_type && (
                    <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest
                      ${announcement.popup_type === 'discount' ? 'bg-amber-50 text-amber-600'
                        : announcement.popup_type === 'new_feature' ? 'bg-blue-50 text-blue-600'
                          : announcement.popup_type === 'system_update' ? 'bg-slate-100 text-slate-600'
                            : 'bg-indigo-50 text-indigo-500'
                      }`}>
                      {announcement.popup_type === 'new_feature' ? 'new feature' : announcement.popup_type === 'system_update' ? 'sys update' : announcement.popup_type}
                    </span>
                  )}
                </div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="text-[13px] font-bold text-slate-900 leading-relaxed">{announcement.message_en || announcement.message}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                disabled={actionLoading === announcement.id}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                    ${announcement.is_active
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
              >
                {actionLoading === announcement.id ? '...' : announcement.is_active ? 'Off' : 'On'}
              </button>
              <button
                onClick={() => handleDelete(announcement.id, announcement.message_en || announcement.message)}
                disabled={actionLoading === announcement.id}
                className="w-11 h-11 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
