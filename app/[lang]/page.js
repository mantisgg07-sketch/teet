import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import AnnouncementPopup from '@/components/AnnouncementPopup'
import Link from 'next/link'
import Image from 'next/image'
import { getTurso } from '@/lib/turso'
import { getDictionary, getLocalizedField } from '@/lib/i18n'

async function getActiveAnnouncements(lang) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM announcements WHERE is_active = 1',
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

async function getFeaturedTours(lang) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: `SELECT id, title, title_en, title_th, title_zh, description, description_en, description_th, description_zh, 
             price, currency, location, location_en, location_th, location_zh, duration, banner_image, dates, created_at 
             FROM tours ORDER BY created_at DESC LIMIT 6`,
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.home.heroTitle} | GoHoliday`,
    description: dict.home.heroDescription,
    openGraph: {
      title: `${dict.home.heroTitle} | GoHoliday`,
      description: dict.home.heroDescription,
      url: `/${lang}`,
      siteName: 'GoHoliday',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: 'GoHoliday - Nepal & Thailand Tours',
        }
      ],
      locale: lang === 'th' ? 'th_TH' : lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.home.heroTitle} | GoHoliday`,
      description: dict.home.heroDescription,
      images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'],
    },
  };
}

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const announcements = await getActiveAnnouncements(lang);
  const featuredTours = await getFeaturedTours(lang);

  const banner = announcements.find(a => a.type === 'banner');
  const popup = announcements.find(a => a.type === 'popup');

  return (
    <div className="min-h-screen">
      {/* Announcement - Dual Rendering Capability */}
      {banner && (
        <AnnouncementBanner
          message={getLocalizedField(banner, 'message', lang)}
        />
      )}

      <Header lang={lang} dict={dict} />

      {popup && (
        <AnnouncementPopup
          announcement={{
            ...popup,
            message: getLocalizedField(popup, 'message', lang)
          }}
        />
      )}

      {/* Hero Section - Professional Nepal-Thailand Focus */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-12 md:py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in">
              {dict.home.heroTitle} <span className="text-accent-400">{dict.home.heroTitleHighlight}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">{dict.home.heroDescription}</p>

            {/* Search Bar Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-4 max-w-4xl mx-auto border border-white/20">
              <div className="flex flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={dict.home.searchPlaceholder}
                    aria-label="Search destination"
                    className="w-full px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-accent-600 text-sm sm:text-base transition-all shadow-lg"
                  />
                </div>
                <Link
                  href={`/${lang}/tours`}
                  className="w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-2xl font-bold text-base sm:text-lg hover:from-accent-700 hover:to-accent-800 transition-all shadow-lg hover:shadow-xl text-center whitespace-nowrap hover:scale-105 transform"
                >
                  {dict.home.exploreTours}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - Nepal & Thailand Focus */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-50 to-white rounded-t-[2rem] sm:rounded-t-[3rem] mt-[-2rem] sm:mt-[-3rem]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {dict.home.destinationsTitle}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.home.destinationsSubtitle}
            </p>
          </div>

          {/* Two Equal Cards - Side by Side */}
          <div className="grid grid-cols-2 gap-3 max-w-6xl mx-auto">
            {/* Nepal - Premium Featured Card */}
            <Link
              href={`/${lang}/tours?location=Nepal`}
              className="group relative h-64 sm:h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070"
                  alt="Nepal destination featuring snow-capped Himalayan mountain peaks and traditional temples"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>
              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/95 transition-all duration-300"></div>
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">{dict.home.nepalTitle}</h3>
                  <p className="text-xs sm:text-sm text-blue-200 transition-opacity duration-300">
                    {dict.home.nepalDescription}
                  </p>
                </div>
              </div>
            </Link>

            {/* Thailand - Premium Featured Card */}
            <Link
              href={`/${lang}/tours?location=Thailand`}
              className="group relative h-64 sm:h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2070"
                  alt="Thailand destination with golden temples, tropical beaches, and vibrant culture"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/95 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">{dict.home.thailandTitle}</h3>
                  <p className="text-xs sm:text-sm text-blue-200 transition-opacity duration-300">
                    {dict.home.thailandDescription}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {dict.home.featuredToursTitle}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.home.featuredToursSubtitle}
            </p>
          </div>

          {featuredTours.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-12">
                {featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} lang={lang} dict={dict} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href={`/${lang}/tours`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  {dict.home.viewAllTours}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">{dict.home.noToursMessage}</p>
              <div className="text-6xl mb-4">🏖️</div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section - Nepal-Thailand Expertise */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {dict.home.whyChooseTitle}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.home.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-100 p-4 sm:p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-2 text-center">{dict.home.expertiseTitle}</h3>
              <p className="text-gray-600 text-center text-[10px] sm:text-sm">{dict.home.expertiseDescription}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-100 p-4 sm:p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-2 text-center">{dict.home.bookingTitle}</h3>
              <p className="text-gray-600 text-center text-[10px] sm:text-sm">{dict.home.bookingDescription}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-100 p-4 sm:p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-2 text-center">{dict.home.supportTitle}</h3>
              <p className="text-gray-600 text-center text-[10px] sm:text-sm">{dict.home.supportDescription}</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-2 border-gray-100 p-4 sm:p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-2 text-center">{dict.home.valueTitle}</h3>
              <p className="text-gray-600 text-center text-[10px] sm:text-sm">{dict.home.valueDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
