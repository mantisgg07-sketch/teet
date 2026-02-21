'use client'

import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const CHANNEL_NAME = 'goholiday-auth-sync'

/**
 * Broadcast an auth event to all tabs in the same browser.
 * Call this from the auth success page after a confirmation link is clicked.
 */
export function broadcastAuthEvent(type, data = {}) {
    if (typeof window === 'undefined') return
    try {
        const channel = new BroadcastChannel(CHANNEL_NAME)
        channel.postMessage({ type, data, timestamp: Date.now() })
        // Close after a short delay to ensure the message is sent
        setTimeout(() => channel.close(), 500)
    } catch (e) {
        // BroadcastChannel not supported in this browser — fallback via localStorage
        try {
            localStorage.setItem('auth_sync_event', JSON.stringify({
                type,
                data,
                timestamp: Date.now()
            }))
            // Clean up after other tabs have read it
            setTimeout(() => localStorage.removeItem('auth_sync_event'), 2000)
        } catch (_) {
            // localStorage also unavailable — no cross-tab sync possible
        }
    }
}

/**
 * Custom hook for cross-tab auth synchronization.
 * 
 * @param {Object} options
 * @param {function} options.onAuthEvent - Callback when an auth event is received from another tab
 * @param {boolean} options.enablePolling - Whether to enable polling for cross-browser email updates
 * @param {string} options.currentEmail - Current user email (used to detect changes when polling)
 * @param {number} options.pollInterval - Polling interval in ms (default: 5000)
 */
export function useAuthSync({
    onAuthEvent,
    enablePolling = false,
    currentEmail = null,
    pollInterval = 5000
} = {}) {
    const onAuthEventRef = useRef(onAuthEvent)
    const currentEmailRef = useRef(currentEmail)
    const pollingRef = useRef(null)

    // Keep refs up to date
    useEffect(() => {
        onAuthEventRef.current = onAuthEvent
    }, [onAuthEvent])

    useEffect(() => {
        currentEmailRef.current = currentEmail
    }, [currentEmail])

    // BroadcastChannel listener for same-browser cross-tab communication
    useEffect(() => {
        if (typeof window === 'undefined') return

        let channel = null
        let storageHandler = null

        try {
            channel = new BroadcastChannel(CHANNEL_NAME)
            channel.onmessage = (event) => {
                if (onAuthEventRef.current && event.data?.type) {
                    onAuthEventRef.current(event.data)
                }
            }
        } catch (e) {
            // Fallback: listen for localStorage changes (works across tabs in same browser)
            storageHandler = (event) => {
                if (event.key === 'auth_sync_event' && event.newValue) {
                    try {
                        const data = JSON.parse(event.newValue)
                        if (onAuthEventRef.current && data?.type) {
                            onAuthEventRef.current(data)
                        }
                    } catch (_) {
                        // Ignore parse errors
                    }
                }
            }
            window.addEventListener('storage', storageHandler)
        }

        return () => {
            if (channel) {
                try { channel.close() } catch (_) { }
            }
            if (storageHandler) {
                window.removeEventListener('storage', storageHandler)
            }
        }
    }, [])

    // Polling mechanism for cross-browser email change detection
    useEffect(() => {
        if (!enablePolling || !currentEmailRef.current || !supabase) return

        const checkForEmailChange = async () => {
            try {
                // getUser() fetches fresh data from the Supabase server
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) return

                if (user.email !== currentEmailRef.current) {
                    // Email has changed! Notify the callback
                    if (onAuthEventRef.current) {
                        onAuthEventRef.current({
                            type: 'email_updated',
                            data: { newEmail: user.email, oldEmail: currentEmailRef.current }
                        })
                    }
                    // Update the ref so we don't fire again
                    currentEmailRef.current = user.email
                    // Stop polling since we detected the change
                    if (pollingRef.current) {
                        clearInterval(pollingRef.current)
                        pollingRef.current = null
                    }
                }
            } catch (e) {
                // Silently handle errors during polling
            }
        }

        pollingRef.current = setInterval(checkForEmailChange, pollInterval)

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current)
                pollingRef.current = null
            }
        }
    }, [enablePolling, pollInterval])

    // Manual trigger to start polling (useful when user initiates email change)
    const startPolling = useCallback((email) => {
        if (!supabase) return
        currentEmailRef.current = email

        // Clear any existing polling
        if (pollingRef.current) {
            clearInterval(pollingRef.current)
        }

        const checkForEmailChange = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) return

                if (user.email !== currentEmailRef.current) {
                    if (onAuthEventRef.current) {
                        onAuthEventRef.current({
                            type: 'email_updated',
                            data: { newEmail: user.email, oldEmail: currentEmailRef.current }
                        })
                    }
                    currentEmailRef.current = user.email
                    if (pollingRef.current) {
                        clearInterval(pollingRef.current)
                        pollingRef.current = null
                    }
                }
            } catch (e) {
                // Silently handle errors
            }
        }

        pollingRef.current = setInterval(checkForEmailChange, pollInterval)
    }, [pollInterval])

    // Stop polling manually
    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
        }
    }, [])

    return { startPolling, stopPolling }
}
