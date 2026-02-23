import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Skeleton from '@/components/Skeleton'

export default function TourDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section Skeleton - Matching actual immersive banner */}
      <section className="w-full">
        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-200 animate-pulse overflow-hidden">
          {/* Back Link Button Skeleton */}
          <div className="absolute top-8 left-6 md:left-12 z-20">
            <Skeleton className="w-24 h-10 rounded-xl bg-white/20" />
          </div>

          {/* Content Overlays Skeleton */}
          <div className="absolute bottom-12 left-6 right-6 md:bottom-16 md:left-12 md:right-12 z-20">
            <div className="max-w-4xl">
              <div className="flex gap-2 mb-4">
                <Skeleton className="w-20 h-6 rounded-lg bg-white/20" />
                <Skeleton className="w-24 h-6 rounded-lg bg-white/20" />
              </div>
              <Skeleton className="h-12 md:h-16 w-3/4 bg-white/30 rounded-lg mb-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid Skeleton */}
      <main className="container mx-auto px-4 md:px-6 mt-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section Skeleton */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Skeleton className="w-1.5 h-8 rounded-full bg-gray-200" />
                <Skeleton variant="title" className="w-1/4 h-8" />
              </div>
              <div className="space-y-4">
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-3/4" />
              </div>
            </div>

            {/* Gallery Section Skeleton */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-1 h-6 rounded-full bg-primary-600" />
                  <Skeleton variant="title" className="w-20 h-6" />
                </div>
                <Skeleton className="w-16 h-5 rounded-full bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-24 hidden lg:block">
              <Skeleton variant="title" className="h-8 w-1/3 mb-6" />
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-20 h-5" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
