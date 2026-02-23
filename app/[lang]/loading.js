export default function Loading() {
    // Minimal generic loading indicator for route transitions.
    // This replaces stale content from the previous page during navigation.
    // Page-specific loading.js files (tours, tour detail, booking) will
    // override this with their own detailed skeletons once the route resolves.
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header placeholder */}
            <div className="h-20 bg-white border-b border-gray-100/50 w-full" />

            {/* Centered spinner */}
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
            </div>
        </div>
    )
}
