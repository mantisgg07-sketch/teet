import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import ProgressBar from '@/components/ProgressBar'

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
    if (typeof window !== 'undefined' && window.location.hash) {
      var hash = window.location.hash;
      if (hash.includes('access_token=') || hash.includes('type=email_change')) {
        var lang = window.location.pathname.split('/')[1] || 'en';
        var allowedLangs = ['en', 'th', 'zh'];
        if (!allowedLangs.includes(lang)) lang = 'en';
        
        var successType = 'email_verified';
        if (hash.includes('type=email_change')) {
          successType = 'email_updated';
        } else if (hash.includes('type=recovery')) {
          window.location.replace('/' + lang + '/login/update-password' + hash);
          return;
        }
        
        window.location.replace('/' + lang + '/auth/success?type=' + successType + hash);
      }
    }
  `;

  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: hashInterceptScript }} />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <CurrencyProvider>
          <ProgressBar />
          {children}
          <WhatsAppFloat />
        </CurrencyProvider>
      </body>
    </html>
  )
}
