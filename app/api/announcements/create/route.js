import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { announcements as announcementsSchema } from '@/lib/schema'
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

    const { message, is_active, type, image_url, popup_type } = await request.json()

    const VALID_TYPES = ['banner', 'popup'];
    const safeType = type && VALID_TYPES.includes(String(type).toLowerCase()) ? String(type).toLowerCase() : 'banner';

    const VALID_POPUP_TYPES = ['discount', 'new_feature', 'system_update', 'general'];
    const safePopupType = popup_type && VALID_POPUP_TYPES.includes(String(popup_type).toLowerCase()) ? String(popup_type).toLowerCase() : 'general';

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Translate announcement message to Thai and Chinese
    const translatedMessages = await translateAnnouncementMessage(message);

    const db = getDb();

    // Insert announcement with type and image_url fields
    await db.insert(announcementsSchema).values({
      message: translatedMessages.message_en,
      message_en: translatedMessages.message_en,
      message_th: translatedMessages.message_th,
      message_zh: translatedMessages.message_zh,
      is_active: is_active ? 1 : 0,
      type: safeType,
      popup_type: safePopupType,
      image_url: image_url || null
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