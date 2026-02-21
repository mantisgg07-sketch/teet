import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTurso } from '@/lib/turso'
import { revalidatePath } from 'next/cache'
import { translateAnnouncementMessage } from '@/lib/translate'

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { message, is_active, type, image_url } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Translate announcement message to Thai and Chinese
    const translatedMessages = await translateAnnouncementMessage(message);

    const turso = getTurso();

    // Insert announcement with type and image_url fields
    await turso.execute({
      sql: 'INSERT INTO announcements (message, message_en, message_th, message_zh, is_active, type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [
        translatedMessages.message_en,
        translatedMessages.message_en,
        translatedMessages.message_th,
        translatedMessages.message_zh,
        is_active ? 1 : 0,
        type || 'banner',
        image_url || null
      ]
    });

    revalidatePath('/admin/announcements')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the announcement' },
      { status: 500 }
    )
  }
}