import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Placeholder */}
            <div className="h-20 bg-white border-b border-gray-100/50 w-full animate-pulse" />

            {/* Page Header Skeleton — Clean and Simple to match page.js */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center flex flex-col items-center">
                    <Skeleton variant="title" className="h-10 sm:h-12 w-1/3 mb-4" />
                    <Skeleton variant="text" className="h-6 w-1/2" />
                </div>
            </section>

            <div className="container mx-auto px-4 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar Skeleton */}
                    <div className="lg:w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <Skeleton variant="title" className="mb-6 w-24" />

                            {/* Filter Section Mocks */}
                            <div className="space-y-6">
                                <div>
                                    <Skeleton variant="text" className="font-bold mb-3 w-20" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full rounded-xl" />
                                    </div>
                                </div>

                                <div>
                                    <Skeleton variant="text" className="font-bold mb-3 w-16" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-full rounded-md" />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Mock */}
                            <div className="mt-8 flex gap-3">
                                <Skeleton className="h-12 flex-1 rounded-xl" />
                                <Skeleton className="h-12 flex-1 rounded-xl bg-gray-100" />
                            </div>
                        </div>
                    </div>

                    {/* Tour Grid Skeleton */}
                    <div className="lg:w-3/4">
                        {/* Mobile Sticky Search Bar Placeholder (Hidden on Desktop) */}
                        <div className="lg:hidden sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 mb-2">
                            <div className="flex gap-2 h-12">
                                <Skeleton className="flex-1 rounded-xl bg-white shadow-sm" />
                                <Skeleton className="w-12 rounded-xl bg-primary-600 shadow-sm" />
                            </div>
                        </div>

                        {/* Desktop Header Controls Mock */}
                        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-4 lg:mt-0">
                            <Skeleton variant="text" className="w-32" />
                        </div>

                        {/* Grid of Tour Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} variant="tourCard" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
