import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import UnifiedMediaGallery from '@/components/UnifiedMediaGallery'
import TourDetailSidebar from '@/components/TourDetailSidebar'
import TourReviews from '@/components/TourReviews'
import { getTurso } from '@/lib/turso'
import { notFound } from 'next/navigation'
import { getDictionary, getLocalizedField } from '@/lib/i18n'
import MobileBookingBar from '@/components/MobileBookingBar'


// ... existing getTour function ...



async function getTour(id) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: `SELECT id, title, title_en, title_th, title_zh, description, description_en, description_th, description_zh,
             price, currency, location, location_en, location_th, location_zh, duration, banner_image, image_urls, video_urls, dates, created_at
             FROM tours WHERE id = ?`,
      args: [id]
    });
    const row = result.rows[0] || null;
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    return {
      title: 'Tour Not Found | GoHoliday',
    };
  }

  const localizedTitle = getLocalizedField(tour, 'title', lang);
  const localizedDescription = getLocalizedField(tour, 'description', lang);
  const localizedLocation = getLocalizedField(tour, 'location', lang);

  const title = `${localizedTitle} | GoHoliday`;
  const shortDescription = localizedDescription ? localizedDescription.substring(0, 160) : '';
  const metaDescription = `${localizedLocation} • ${tour.currency} ${tour.price} • ${shortDescription}...`;

  return {
    title,
    description: metaDescription,
    openGraph: {
      title,
      description: metaDescription,
      url: `/${lang}/tours/${id}`,
      siteName: 'GoHoliday',
      images: tour.banner_image ? [
        {
          url: tour.banner_image,
          width: 1200,
          height: 630,
          alt: localizedTitle,
        }
      ] : [],
      locale: lang === 'th' ? 'th_TH' : lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: tour.banner_image ? [tour.banner_image] : [],
    },
  };
}

export default async function TourDetailPage({ params }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const tour = await getTour(id);

  if (!tour) {
    notFound();
  }

  // Parse image and video URLs from JSON
  let galleryImages = [];
  let videoUrls = [];
  try {
    if (tour.image_urls) {
      galleryImages = JSON.parse(tour.image_urls);
    }
    if (tour.video_urls) {
      videoUrls = JSON.parse(tour.video_urls);
    }
  } catch (error) {
    console.error('Error parsing gallery URLs:', error);
  }

  // Get localized fields
  const localizedTitle = getLocalizedField(tour, 'title', lang);
  const localizedDescription = getLocalizedField(tour, 'description', lang);
  const localizedLocation = getLocalizedField(tour, 'location', lang);
  const activeMediaCount = (galleryImages?.length || 0) + (videoUrls?.length || 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header lang={lang} dict={dict} />

      {/* Hero Section - Immersive Full-Width Banner */}
      <section className="w-full animate-fade-in">
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          {tour.banner_image ? (
            <Image
              src={tour.banner_image}
              alt={localizedTitle}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-8xl grayscale opacity-10">🏖️</span>
            </div>
          )}

          {/* Aggressive Bottom Fade - Perfectly blends the last 5-8% of the image into the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent from-0% via-[5%] to-[15%] z-10"></div>

          {/* Text Readability Overlay - Deeper at the bottom for white text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0"></div>

          {/* Breadcrumb / Back Link */}
          <div className="absolute top-8 left-6 md:left-12 z-20">
            <Link
              href={`/${lang}/tours`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-black/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              {dict.tourDetail.backToTours || 'Back'}
            </Link>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-12 left-6 right-6 md:bottom-16 md:left-12 md:right-12 z-20">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {localizedLocation}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {tour.duration}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase mb-4 drop-shadow-xl">
                {localizedTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="container mx-auto px-4 md:px-6 mt-12 relative z-30 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Details & Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-gray-900 rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{dict.tourDetail.aboutTour}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-xl font-medium italic">
                {localizedDescription}
              </p>
            </div>

            {/* Gallery Section */}
            {(videoUrls.length > 0 || galleryImages.length > 0) && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{dict.tourDetail.gallery || 'Gallery'}</h2>
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {activeMediaCount} Assets
                  </div>
                </div>
                <UnifiedMediaGallery
                  videos={videoUrls}
                  images={galleryImages}
                  tourTitle={localizedTitle}
                />
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
              <TourReviews tourId={tour.id} lang={lang} dict={dict} />
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-1" id="booking-section">
            <div className="sticky top-24 hidden lg:block">
              <TourDetailSidebar tour={tour} lang={lang} dict={dict} />
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky Mobile Booking Bar (Client Component) */}
      <MobileBookingBar
        tourId={tour.id}
        tourTitle={localizedTitle}
        price={tour.price}
        currency={tour.currency}
        dict={dict}
      />

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
