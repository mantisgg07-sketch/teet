import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTurso } from '@/lib/turso'
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

    const turso = getTurso();
    await turso.execute({
      sql: `INSERT INTO tours (title, title_en, title_th, title_zh, description, description_en, description_th, description_zh, 
                               location, location_en, location_th, location_zh, price, currency, duration, dates, 
                               banner_image, image_urls, video_urls) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        translatedFields.title_en,
        translatedFields.title_en,
        translatedFields.title_th,
        translatedFields.title_zh,
        translatedFields.description_en,
        translatedFields.description_en,
        translatedFields.description_th,
        translatedFields.description_zh,
        translatedFields.location_en,
        translatedFields.location_en,
        translatedFields.location_th,
        translatedFields.location_zh,
        price,
        currency || 'USD',
        duration,
        dates,
        banner_image || null,
        image_urls || '[]',
        video_urls || '[]'
      ]
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