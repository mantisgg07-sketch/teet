import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { getTurso } from '@/lib/turso'
import AnnouncementForm from './AnnouncementForm'
import AnnouncementList from './AnnouncementList'

async function getAllAnnouncements() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM announcements ORDER BY created_at DESC',
      args: []
    });
    return JSON.parse(JSON.stringify(result.rows));
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
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
          Announcements
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 ml-1">
          Post and manage site alerts
        </p>
      </div>

      <div className="space-y-12">
        {/* Add New Announcement Form */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Add New</h2>
          </div>
          <div className="p-8">
            <AnnouncementForm />
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">All Announcements</h2>
          </div>
          <div className="p-2 md:p-8">
            <AnnouncementList announcements={announcements} />
          </div>
        </div>
      </div>
    </div>
  )
}
