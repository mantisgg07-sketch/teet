import { getTurso } from '@/lib/turso'
import { getDictionary, getLocalizedField } from '@/lib/i18n'
import BookingForm from '@/components/BookingForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getTour(id) {
    try {
        const turso = getTurso();
        const result = await turso.execute({
            sql: `SELECT id, title, title_en, title_th, title_zh, price, currency, duration, banner_image FROM tours WHERE id = ?`,
            args: [id]
        });
        const row = result.rows[0] || null;
        return row ? JSON.parse(JSON.stringify(row)) : null;
    } catch (error) {
        console.error('Error fetching tour:', error);
        return null; // Handle error gracefully
    }
}

export default async function BookingPage({ params }) {
    const { lang, id } = await params;
    const dict = await getDictionary(lang);
    const tour = await getTour(id);

    if (!tour) {
        notFound();
    }

    const localizedTitle = getLocalizedField(tour, 'title', lang);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header lang={lang} dict={dict} />

            <div className="container mx-auto px-4 py-8 md:py-12">
                <Link href={`/${lang}/tours/${id}`} className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 font-medium transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {dict?.tourDetail?.backToTours || 'Back to Tour Details'}
                </Link>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tour Summary Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
                            <div className="relative h-48 w-full">
                                {tour.banner_image ? (
                                    <Image
                                        src={tour.banner_image}
                                        alt={localizedTitle}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                        🏖️
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{localizedTitle}</h2>
                                <div className="flex items-center text-gray-600 mb-4 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {tour.duration}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Section */}
                    <div className="md:col-span-2">
                        <BookingForm
                            tourId={tour.id}
                            tourTitle={localizedTitle}
                            basePrice={tour.price}
                            currency={tour.currency}
                            dict={dict}
                        />
                    </div>
                </div>
            </div>

            <Footer lang={lang} dict={dict} />
        </div>
    )
}
