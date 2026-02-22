import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { AuthProvider } from '@/components/AuthProvider'
import ProgressBar from '@/components/ProgressBar'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://goholiday.com'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  // Script to intercept Supabase implicit flow hash fragments (e.g. from email confirmation links)
  // before React hydration, as Next.js server cannot see `#` fragments.
  const hashInterceptScript = `
    (function() {
      if (typeof window !== 'undefined' && window.location.hash) {
        var hash = window.location.hash;
        var pathname = window.location.pathname;
        var lang = pathname.split('/')[1] || 'en';
        var allowedLangs = ['en', 'th', 'zh'];
        if (!allowedLangs.includes(lang)) lang = 'en';

        // Prevent infinite loops if we are already on the success or update-password page
        if (pathname.includes('/auth/success') || pathname.includes('/login/update-password')) {
          return;
        }

        // Email change: go to success without storing tokens so this browser does not auto-login
        if (hash.includes('type=email_change')) {
          window.location.replace('/' + lang + '/auth/success?type=email_updated');
          return;
        }
        if (hash.includes('access_token=') || hash.includes('type=recovery')) {
          if (hash.includes('type=recovery')) {
            window.location.replace('/' + lang + '/login/update-password' + hash);
            return;
          }
          if (hash.includes('access_token=')) {
            window.location.replace('/' + lang + '/auth/success?type=email_verified' + hash);
          }
        }
      }
    })();
  `;

  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: hashInterceptScript }} />
      </head>
      <body className={plusJakartaSans.className} suppressHydrationWarning>
        <AuthProvider>
          <CurrencyProvider>
            <ProgressBar />
            {children}
            <WhatsAppFloat />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
