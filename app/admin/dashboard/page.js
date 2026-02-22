import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { getTurso } from '@/lib/turso'
import DeleteTourButton from './DeleteTourButton'
import TourPriceDisplay from './TourPriceDisplay'
import Skeleton from '@/components/Skeleton'

async function getStats() {
  try {
    const turso = getTurso();
    const toursResult = await turso.execute('SELECT COUNT(*) as count FROM tours');
    const announcementsResult = await turso.execute('SELECT COUNT(*) as count FROM announcements WHERE is_active = 1');
    const bookingsResult = await turso.execute('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"');

    return {
      totalTours: toursResult.rows[0].count,
      activeAnnouncements: announcementsResult.rows[0].count,
      pendingBookings: bookingsResult.rows[0].count,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalTours: 0, activeAnnouncements: 0, pendingBookings: 0 };
  }
}

async function getAllTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute('SELECT * FROM tours ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin');
  }

  const stats = await getStats();
  const tours = await getAllTours();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
            Dash<span className="text-indigo-600">board</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 ml-1">
            Admin Management Overview
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Add New Tour
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
        <div className="pro-card rounded-2xl p-5 md:p-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-sm">
              🏖️
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Tours</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stats.totalTours} <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Tours</span></p>
            </div>
          </div>
        </div>

        <div className="pro-card rounded-2xl p-5 md:p-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-sm">
              📢
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Announcements</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stats.activeAnnouncements} <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Active</span></p>
            </div>
          </div>
        </div>

        <Link href="/admin/bookings" className="pro-card rounded-2xl p-5 md:p-8 hover:border-indigo-200 group">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-sm group-hover:bg-green-100 transition-colors">
              📅
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Bookings</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{stats.pendingBookings} <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Pending</span></p>
            </div>
          </div>
        </Link>

        <Link href="/admin/customers" className="pro-card rounded-2xl p-5 md:p-8 hover:border-indigo-200 group">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-sm group-hover:bg-indigo-50 transition-colors">
              👥
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Customers</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">Stats <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">&rarr;</span></p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tours Section */}
      <div className="pro-card rounded-[2rem] overflow-hidden">
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">All Tours</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage your tour listings</p>
          </div>
          <Link
            href="/admin/tours/new"
            className="w-10 h-10 md:w-auto md:px-6 md:py-3 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">Add Tour</span>
          </Link>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group relative bg-slate-50/50 border border-slate-100 hover:border-indigo-600 hover:bg-white rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-600/10"
              >
                {/* Image Section */}
                <div className="relative h-40 md:h-56 w-full overflow-hidden">
                  {tour.banner_image ? (
                    <Image
                      src={tour.banner_image}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl grayscale grayscale-100 group-hover:grayscale-0 transition-all italic font-black text-slate-400">
                      NULL
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                      #{tour.id}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 md:p-6 pt-6 md:pt-8 relative">
                  <div className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1.5 md:mb-2">{tour.duration} experience</div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter mb-3 md:mb-4 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {tour.title_en || tour.title}
                  </h3>

                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex-1">
                      <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</div>
                      <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                        <TourPriceDisplay price={tour.price} currency={tour.currency} />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-tight truncate">
                        {tour.location_en || tour.location}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex gap-2 pt-4 md:pt-6 border-t border-slate-100">
                    <Link
                      href={`/admin/tours/edit/${tour.id}`}
                      className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest text-center hover:bg-indigo-600 transition-all active:scale-95"
                    >
                      Edit
                    </Link>
                    <DeleteTourButton tourId={tour.id} tourTitle={tour.title_en || tour.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="text-7xl mb-6 grayscale opacity-40">⛱️</div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">No active tours</h3>
            <p className="text-gray-500 font-medium mb-8">Ready to expand your portfolio?</p>
            <Link
              href="/admin/tours/new"
              className="inline-block px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 shadow-[0_20px_50px_-20px_rgba(255,102,0,0.4)] active:scale-95"
            >
              Add Your First Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
