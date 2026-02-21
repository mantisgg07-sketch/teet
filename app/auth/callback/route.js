import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type') // email_verified, password_reset, etc.
  
  // Get the lang from the request or default to 'en'
  const lang = requestUrl.searchParams.get('lang') || 'en'

  if (code) {
    // Existing PKCE flow for normal logins
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL(`/${lang}/login?error=auth_failed`, requestUrl.origin))
      }

      let successType = 'email_verified'
      if (type === 'recovery') {
        return NextResponse.redirect(new URL(`/${lang}/login/update-password`, requestUrl.origin))
      } else if (type === 'email_change') {
        successType = 'email_updated'
      }

      return NextResponse.redirect(new URL(`/${lang}/auth/success?type=${successType}`, requestUrl.origin))
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(new URL(`/${lang}/login?error=unexpected`, requestUrl.origin))
    }
  } else if (requestUrl.searchParams.get('token_hash')) {
    // Handle email change confirmations (token_hash flow)
    const token_hash = requestUrl.searchParams.get('token_hash')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type || 'email', // default to email if type is missing, but it is usually email_change
      })

      if (error) {
        console.error('Error verifying OTP for email change:', error)
        return NextResponse.redirect(new URL(`/${lang}/login?error=auth_failed`, requestUrl.origin))
      }

      let successType = 'email_verified'
      if (type === 'email_change') {
        successType = 'email_updated'
      }

      return NextResponse.redirect(new URL(`/${lang}/auth/success?type=${successType}`, requestUrl.origin))
    } catch (err) {
      console.error('Unexpected error in auth callback OTP verification:', err)
      return NextResponse.redirect(new URL(`/${lang}/login?error=unexpected`, requestUrl.origin))
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(new URL(`/${lang}`, requestUrl.origin))
}
