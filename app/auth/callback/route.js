import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type') // email_verified, password_reset, etc.
  
  // Get the lang from the request or default to 'en'
  const lang = requestUrl.searchParams.get('lang') || 'en'

  if (code) {
    // Create a Supabase client for server-side authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to login with error
        return NextResponse.redirect(new URL(`/${lang}/login?error=auth_failed`, requestUrl.origin))
      }

      // Determine redirect based on type
      let successType = 'email_verified'
      
      if (type === 'recovery') {
        // Password reset - redirect to update password page
        return NextResponse.redirect(new URL(`/${lang}/login/update-password`, requestUrl.origin))
      } else if (type === 'email_change') {
        successType = 'email_updated'
      }

      // Redirect to success page with appropriate type
      return NextResponse.redirect(new URL(`/${lang}/auth/success?type=${successType}`, requestUrl.origin))
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(new URL(`/${lang}/login?error=unexpected`, requestUrl.origin))
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(new URL(`/${lang}`, requestUrl.origin))
}
