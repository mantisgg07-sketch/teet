import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { announcements as announcementsSchema } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import AnnouncementForm from './AnnouncementForm'
import AnnouncementList from './AnnouncementList'

async function getAllAnnouncements() {
  try {
    const db = getDb();
    const result = await db.select().from(announcementsSchema).orderBy(desc(announcementsSchema.created_at));
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin');
  }

  const announcements = await getAllAnnouncements();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
          Alerts
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-1 ml-1">
          System Signals
        </p>
      </div>

      <div className="space-y-4">
        {/* Add New Announcement Form */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/10">
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tighter">Add New</h2>
          </div>
          <div className="p-4">
            <AnnouncementForm />
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
            <h2 className="text-base font-black text-gray-900 uppercase tracking-tighter">Alert History</h2>
          </div>
          <div className="p-1 md:p-3">
            <AnnouncementList announcements={announcements} />
          </div>
        </div>
      </div>
    </div>
  )
}
