import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { tours as toursSchema } from '@/lib/schema'
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
    const { title, description, price, currency, duration, dates, location, banner_image, image_urls, video_urls } = data

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
    await db.insert(toursSchema).values({
      title: translatedFields.title_en,
      title_en: translatedFields.title_en,
      title_th: translatedFields.title_th,
      title_zh: translatedFields.title_zh,
      description: translatedFields.description_en,
      description_en: translatedFields.description_en,
      description_th: translatedFields.description_th,
      description_zh: translatedFields.description_zh,
      location: translatedFields.location_en,
      location_en: translatedFields.location_en,
      location_th: translatedFields.location_th,
      location_zh: translatedFields.location_zh,
      price: price,
      currency: currency || 'USD',
      duration: duration,
      dates: dates,
      banner_image: banner_image || null,
      image_urls: image_urls || '[]',
      video_urls: video_urls || '[]'
    });

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the tour' },
      { status: 500 }
    )
  }
}