import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { tours as toursSchema } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { translateTourFields } from '@/lib/translate'

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, title, description, price, currency, duration, dates, location, banner_image, image_urls, video_urls, is_discount_active, discount_percentage } = data

    const safeId = parseInt(id, 10)
    if (Number.isNaN(safeId) || safeId < 1) {
      return NextResponse.json(
        { error: 'Invalid tour ID' },
        { status: 400 }
      )
    }

    // Validation
    if (!title || !description || !price || !duration || !dates || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Translate tour fields to Thai and Chinese
    const translatedFields = await translateTourFields({ title, description, location });

    const db = getDb();
    await db.update(toursSchema).set({
      title_en: translatedFields.title_en,
      title_th: translatedFields.title_th,
      title_zh: translatedFields.title_zh,
      description_en: translatedFields.description_en,
      description_th: translatedFields.description_th,
      description_zh: translatedFields.description_zh,
      location_en: translatedFields.location_en,
      location_th: translatedFields.location_th,
      location_zh: translatedFields.location_zh,
      price: price,
      currency: currency || 'USD',
      duration: duration,
      dates: dates,
      banner_image: banner_image,
      image_urls: JSON.stringify(image_urls || []),
      video_urls: JSON.stringify(video_urls || []),
      is_discount_active: is_discount_active ? 1 : 0,
      discount_percentage: is_discount_active && discount_percentage ? parseFloat(discount_percentage) : null
    }).where(eq(toursSchema.id, id));

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath(`/tours/${safeId}`)
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the tour' },
      { status: 500 }
    )
  }
}
