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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
            Control Center
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Monitor and manage your holiday experiences.
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 active:scale-95 text-center"
        >
          + Create New Tour
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              🏖️
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Portfolio</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.totalTours} <span className="text-xs text-gray-400 font-bold ml-1 uppercase">Tours</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              📢
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Marketing</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.activeAnnouncements} <span className="text-xs text-gray-400 font-bold ml-1 uppercase">Active</span></p>
            </div>
          </div>
        </div>

        <Link href="/admin/bookings" className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-primary-100 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-green-100 transition-colors">
              📅
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Revenue Queue</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-primary-600 transition-colors">{stats.pendingBookings} <span className="text-xs text-gray-400 font-bold ml-1 uppercase">Pending</span></p>
            </div>
          </div>
        </Link>

        <Link href="/admin/customers" className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-indigo-100 transition-colors">
              👥
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Growth</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-indigo-600 transition-colors">Insights <span className="text-xs text-gray-400 font-bold ml-1 uppercase">&rar;</span></p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tours Management Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Inventory Management</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Manage your experiences and availability</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find a tour..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all font-bold text-sm tracking-tight outline-none"
              />
              <svg className="w-5 h-5 text-gray-300 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group relative bg-gray-50 border-2 border-transparent hover:border-primary-600 hover:bg-white rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/10"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  {tour.banner_image ? (
                    <Image
                      src={tour.banner_image}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl grayscale grayscale-100 group-hover:grayscale-0 transition-all">
                      🏖️
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                      #{tour.id}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-8 relative">
                  <div className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-2">{tour.duration} experience</div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {tour.title_en || tour.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Investment</div>
                      <div className="text-2xl font-black text-gray-900">
                        <TourPriceDisplay price={tour.price} currency={tour.currency} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-sm font-black text-gray-700 uppercase tracking-tight truncate">
                        {tour.location_en || tour.location}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex gap-2 pt-6 border-t border-gray-100">
                    <Link
                      href={`/admin/tours/edit/${tour.id}`}
                      className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-center hover:bg-primary-600 transition-all active:scale-95"
                    >
                      Configure
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
              Launch Your First Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
