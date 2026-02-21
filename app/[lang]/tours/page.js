import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourSearch from '@/components/TourSearch'
import { getTurso } from '@/lib/turso'
import { getDictionary } from '@/lib/i18n'
import Skeleton from '@/components/Skeleton'

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.tours.pageTitle} | GoHoliday`,
    description: dict.tours.pageDescription,
    openGraph: {
      title: `${dict.tours.pageTitle} | GoHoliday`,
      description: dict.tours.pageDescription,
      url: `/${lang}/tours`,
      siteName: 'GoHoliday',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: 'GoHoliday Tours Search',
        }
      ],
      locale: lang === 'th' ? 'th_TH' : lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.tours.pageTitle} | GoHoliday`,
      description: dict.tours.pageDescription,
      images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'],
    },
  };
}

async function getAllTours(lang) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: `SELECT id, title, title_en, title_th, title_zh, description, description_en, description_th, description_zh, 
             price, currency, location, location_en, location_th, location_zh, duration, banner_image, dates, created_at 
             FROM tours ORDER BY created_at DESC`,
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function ToursPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const tours = await getAllTours(lang);

  return (
    <div className="min-h-screen">
      <Header lang={lang} dict={dict} />

      {/* Page Header - Clean and Simple */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {dict.tours.pageTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dict.tours.pageDescription}
          </p>
        </div>
      </section>

      {/* Tours with Search & Filter */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {tours.length > 0 ? (
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} variant="tourCard" />
                ))}
              </div>
            }>
              <TourSearch tours={tours} lang={lang} dict={dict} />
            </Suspense>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-6">🏖️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{dict.tours.noToursTitle}</h2>
              <p className="text-gray-600">{dict.tours.noToursMessage}</p>
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
