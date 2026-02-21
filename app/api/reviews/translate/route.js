import { NextResponse } from 'next/server'
import { translateReviewComment } from '@/lib/translate'

// Simple in-memory rate limiter
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 20 // max requests per window per IP

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }
  return false
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000) // every 5 minutes

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const data = await request.json()
    const { comment } = data

    // Validation
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      )
    }

    // Input length validation
    if (typeof comment !== 'string' || comment.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be a string under 2000 characters' },
        { status: 400 }
      )
    }

    // Translate comment to Thai and Chinese
    const translatedComment = await translateReviewComment(comment.trim())

    return NextResponse.json(translatedComment)
  } catch (error) {
    console.error('Translate review comment error:', error.message)
    return NextResponse.json(
      { error: 'An error occurred while translating the comment' },
      { status: 500 }
    )
  }
}
