import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Placeholder */}
            <div className="h-20 bg-white border-b border-gray-100/50 w-full animate-pulse" />

            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Back Link Skeleton */}
                <div className="flex items-center mb-6">
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton variant="text" className="w-32 h-5" />
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Tour Summary Card Skeleton */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 border border-gray-100/50">
                            <Skeleton className="h-48 w-full rounded-none" />
                            <div className="p-6">
                                <Skeleton variant="title" className="mb-3 h-6 w-5/6" />
                                <div className="flex items-center text-sm">
                                    <Skeleton className="w-4 h-4 mr-2" />
                                    <Skeleton variant="text" className="w-16 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Form Section Skeleton */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-50" style={{ minHeight: '600px' }}>
                            {/* Form Title */}
                            <Skeleton variant="title" className="h-10 w-2/3 mb-4" />
                            <Skeleton variant="text" className="h-6 w-1/2 mb-10" />

                            <div className="space-y-6">
                                {/* Guests Counter Skeleton */}
                                <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-200/60 space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <div className="w-1/3">
                                            <Skeleton variant="text" className="h-4 w-16 mb-1" />
                                            <Skeleton variant="text" className="h-3 w-20" />
                                        </div>
                                        <Skeleton className="h-12 w-32 rounded-xl" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="w-1/3">
                                            <Skeleton variant="text" className="h-4 w-20 mb-1" />
                                            <Skeleton variant="text" className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-12 w-32 rounded-xl" />
                                    </div>
                                </div>

                                {/* Input Fields Skeletons */}
                                <div className="space-y-4">
                                    <div>
                                        <Skeleton variant="text" className="h-3 w-24 mb-3" />
                                        <Skeleton className="h-14 w-full rounded-[1.25rem]" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Skeleton variant="text" className="h-3 w-16 mb-3" />
                                            <Skeleton className="h-14 w-full rounded-[1.25rem]" />
                                        </div>
                                        <div>
                                            <Skeleton variant="text" className="h-3 w-16 mb-3" />
                                            <Skeleton className="h-14 w-full rounded-[1.25rem]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Method Skeleton */}
                                <div>
                                    <Skeleton variant="text" className="h-3 w-24 mb-4" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-12 flex-1 rounded-2xl" />
                                        <Skeleton className="h-12 flex-1 rounded-2xl" />
                                    </div>
                                </div>

                                {/* Footer Total Skeleton */}
                                <div className="bg-gray-50 px-6 py-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group border border-gray-100 mt-8">
                                    <div className="text-center md:text-left">
                                        <Skeleton variant="text" className="h-3 w-24 mb-2" />
                                        <Skeleton variant="title" className="h-10 w-32" />
                                    </div>
                                    <Skeleton className="h-14 w-40 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
