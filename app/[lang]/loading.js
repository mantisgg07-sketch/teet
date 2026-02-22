import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Header Placeholder */}
            <div className="h-20 bg-white border-b border-gray-100/50 w-full animate-pulse" />

            {/* Hero Section Skeleton */}
            <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-12 md:py-16 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
                        {/* Title Skeleton */}
                        <Skeleton variant="title" className="h-12 sm:h-16 w-3/4 mb-4 bg-white/20" />
                        <Skeleton variant="text" className="h-6 w-5/6 mb-2 bg-white/20" />
                        <Skeleton variant="text" className="h-6 w-2/3 mb-10 bg-white/20" />

                        {/* Search Bar Skeleton */}
                        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-3 sm:p-4 max-w-4xl mx-auto w-full border border-white/20">
                            <div className="flex flex-row gap-2 h-12 sm:h-14">
                                <Skeleton className="flex-1 rounded-2xl bg-white/30" />
                                <Skeleton className="w-32 sm:w-40 rounded-2xl bg-white/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Destinations Skeleton */}
            <section className="relative z-10 py-20 bg-gradient-to-b from-gray-50 to-white rounded-t-[2rem] sm:rounded-t-[3rem] mt-[-2rem] sm:mt-[-3rem]">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton variant="title" className="w-1/3 mb-3" />
                        <div className="h-1 w-24 bg-gray-200 mx-auto rounded-full mb-4 animate-pulse"></div>
                        <Skeleton variant="text" className="w-1/2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-6xl mx-auto">
                        {/* Destination Card 1 */}
                        <Skeleton variant="card" className="h-64 sm:h-80 md:h-[500px] rounded-3xl" />
                        {/* Destination Card 2 */}
                        <Skeleton variant="card" className="h-64 sm:h-80 md:h-[500px] rounded-3xl" />
                    </div>
                </div>
            </section>

            {/* Featured Tours Skeleton */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton variant="title" className="w-1/3 mb-3" />
                        <div className="h-1 w-24 bg-gray-200 mx-auto rounded-full mb-4 animate-pulse"></div>
                        <Skeleton variant="text" className="w-1/2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-12">
                        <Skeleton variant="tourCard" />
                        <Skeleton variant="tourCard" />
                        <Skeleton variant="tourCard" />
                        <Skeleton variant="tourCard" className="hidden lg:block" />
                        <Skeleton variant="tourCard" className="hidden lg:block" />
                        <Skeleton variant="tourCard" className="hidden lg:block" />
                    </div>
                </div>
            </section>
        </div>
    )
}
