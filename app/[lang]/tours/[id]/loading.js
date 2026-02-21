import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Skeleton from '@/components/Skeleton'

export default function TourDetailLoading() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Banner Image Skeleton */}
      <section className="relative">
        <Skeleton variant="banner" />
      </section>

      {/* Tour Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                {/* Title Skeleton */}
                <Skeleton variant="title" />
                
                {/* Description Text Skeletons */}
                <div className="space-y-2">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" className="w-5/6" />
                  <Skeleton variant="text" className="w-4/5" />
                </div>
              </div>

              {/* Gallery Section Skeleton */}
              <div className="mb-8">
                <Skeleton variant="title" className="w-1/4 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <Skeleton variant="title" className="mb-4" />
                <Skeleton variant="text" className="mb-2" />
                <Skeleton variant="text" className="mb-2" />
                <Skeleton variant="text" className="mb-4" />
                <Skeleton className="h-12 w-full rounded-lg mt-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Tours Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Skeleton variant="text" className="w-32 h-6" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
