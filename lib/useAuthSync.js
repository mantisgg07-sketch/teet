'use client'

import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Broadcast an auth event over Supabase Realtime to all connected 
 * clients listening to this user's channel.
 * 
 * @param {string} type - Event type (e.g., 'email_updated')
 * @param {string} userId - The ID of the user the event belongs to
 * @param {Object} data - Additional data payload
 */
export async function broadcastAuthEvent(type, userId, data = {}) {
    if (typeof window === 'undefined' || !supabase || !userId) return

    try {
        const channelName = `auth-sync-${userId}`
        const channel = supabase.channel(channelName)

        // Subscribe and broadcast the event
        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.send({
                    type: 'broadcast',
                    event: type,
                    payload: { data, timestamp: Date.now() }
                })

                // Clean up the channel after a short delay
                setTimeout(() => {
                    supabase.removeChannel(channel)
                }, 1000)
            }
        })
    } catch (e) {
        console.error('Failed to broadcast auth event via Realtime:', e)
    }
}

/**
 * Custom hook for cross-browser, cross-tab auth synchronization
 * using Supabase Realtime WebSockets.
 * 
 * @param {Object} options
 * @param {string} options.userId - The ID of the current user (required to scope the channel)
 * @param {function} options.onAuthEvent - Callback when an auth event is received
 */
export function useAuthSync({ userId, onAuthEvent } = {}) {
    const onAuthEventRef = useRef(onAuthEvent)

    // Keep ref up to date
    useEffect(() => {
        onAuthEventRef.current = onAuthEvent
    }, [onAuthEvent])

    // Set up Supabase Realtime subscription
    useEffect(() => {
        if (typeof window === 'undefined' || !supabase || !userId) return

        const channelName = `auth-sync-${userId}`
        const channel = supabase.channel(channelName)

        // Listen for broadcast events
        channel
            .on('broadcast', { event: 'email_updated' }, (payload) => {
                if (onAuthEventRef.current) {
                    onAuthEventRef.current({ type: 'email_updated', data: payload.payload?.data })
                }
            })
            .on('broadcast', { event: 'email_verified' }, (payload) => {
                if (onAuthEventRef.current) {
                    onAuthEventRef.current({ type: 'email_verified', data: payload.payload?.data })
                }
            })
            .subscribe((status, err) => {
                if (err) console.error('Error subscribing to auth-sync channel:', err)
            })

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    // Maintain backward compatibility with returned object, but polling functions are no-ops
    const startPolling = useCallback(() => { }, [])
    const stopPolling = useCallback(() => { }, [])

    return { startPolling, stopPolling }
}
