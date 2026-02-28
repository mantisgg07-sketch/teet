/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint runs during production builds to catch code quality issues.
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Immutable long-term caching for static assets (JS, CSS, images)
        // These have content hashes in their filenames so stale delivery is impossible.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Smart ISR-compatible caching for all HTML pages.
        // `stale-while-revalidate` tells browsers/CDNs to serve the cached page
        // INSTANTLY while quietly fetching a fresh version in the background.
        // This is what makes ISR ultra-fast for end users AND for Google PageSpeed.
        source: '/((?!_next/static|_next/image|favicon.ico|img|images|logo.png).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig

