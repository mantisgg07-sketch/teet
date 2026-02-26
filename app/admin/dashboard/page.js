import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { getDb } from '@/lib/turso'
import { tours as toursSchema, announcements as announcementsSchema, bookings as bookingsSchema } from '@/lib/schema'
import { eq, desc, count } from 'drizzle-orm'
import DeleteTourButton from './DeleteTourButton'
import TourPriceDisplay from './TourPriceDisplay'
import Skeleton from '@/components/Skeleton'

async function getStats() {
  try {
    const db = getDb();
    const [toursResult, announcementsResult, bookingsResult] = await Promise.all([
      db.select({ value: count() }).from(toursSchema),
      db.select({ value: count() }).from(announcementsSchema).where(eq(announcementsSchema.is_active, 1)),
      db.select({ value: count() }).from(bookingsSchema).where(eq(bookingsSchema.status, "pending")),
    ]);

    return {
      totalTours: toursResult[0]?.value || 0,
      activeAnnouncements: announcementsResult[0]?.value || 0,
      pendingBookings: bookingsResult[0]?.value || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalTours: 0, activeAnnouncements: 0, pendingBookings: 0 };
  }
}

async function getAllTours() {
  try {
    const db = getDb();
    const result = await db.select().from(toursSchema).orderBy(desc(toursSchema.created_at));
    return result.map(row => JSON.parse(JSON.stringify(row)));
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

  const [stats, tours] = await Promise.all([getStats(), getAllTours()]);

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
            Dash<span className="text-indigo-600">board</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-1 ml-1">
            Admin Overview
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Add Tour
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6">
        <div className="pro-card rounded-xl tight-padding">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M12 3c-1.5 2-2.5 4-2.5 7h5C14.5 7 13.5 5 12 3zM7 10c-1.5-1.5-4-2-6-1.5C3 10 5 11 7 10zm10 0c1.5-1.5 4-2 6-1.5-2 1.5-4 2.5-6 1.5zM12 10v11" /></svg>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Total Tours</p>
              <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{stats.totalTours} <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Tours</span></p>
            </div>
          </div>
        </div>

        <div className="pro-card rounded-xl tight-padding">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Announcements</p>
              <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{stats.activeAnnouncements} <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Active</span></p>
            </div>
          </div>
        </div>

        <Link href="/admin/bookings" className="pro-card rounded-xl tight-padding hover:border-indigo-200 group">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-100 transition-colors">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Bookings</p>
              <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{stats.pendingBookings} <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Pending</span></p>
            </div>
          </div>
        </Link>

        <Link href="/admin/customers" className="pro-card rounded-xl tight-padding hover:border-indigo-200 group">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-50 transition-colors">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Customers</p>
              <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">Stats <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">&rarr;</span></p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tours Section */}
      <div className="pro-card rounded-[1.5rem] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tighter">All Tours</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management Center</p>
          </div>
          <Link
            href="/admin/tours/new"
            className="w-8 h-8 md:w-auto md:px-4 md:py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 group shadow-lg active:scale-95"
          >
            <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="group relative bg-slate-50/50 border border-slate-100 hover:border-indigo-600 hover:bg-white rounded-xl md:rounded-[1.2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-600/10"
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
            <div className="mb-6 opacity-40">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M12 3c-1.5 2-2.5 4-2.5 7h5C14.5 7 13.5 5 12 3zM7 10c-1.5-1.5-4-2-6-1.5C3 10 5 11 7 10zm10 0c1.5-1.5 4-2 6-1.5-2 1.5-4 2.5-6 1.5zM12 10v11" /></svg>
            </div>
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
