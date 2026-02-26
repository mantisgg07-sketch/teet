import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, redirectTo } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        // 1. Verify existence in public.profiles
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, email')
            .ilike('email', email)
            .limit(1)

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('[API ForgotPassword] Database query error:', profileError)
            // We don't block strictly on this to avoid network flakiness affecting flow, 
            // but if we genuinely get an error from Supabase we log it.
        }

        const profile = profiles?.[0]

        if (!profile) {
            return NextResponse.json({ error: 'Account not found for this email address.' }, { status: 404 })
        }

        // 2. Request password reset from Supabase Auth
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        })

        if (resetError) {
            console.error('[API ForgotPassword] resetPasswordForEmail error:', resetError)
            return NextResponse.json({ error: resetError.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Reset link has been sent to email.' })
    } catch (error) {
        console.error('[API ForgotPassword] Unexpected error:', error)
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
    }
}
