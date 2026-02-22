import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { tours as toursSchema } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tourId } = await request.json()

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      )
    }

    const db = getDb();
    await db.delete(toursSchema).where(eq(toursSchema.id, tourId));

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the tour' },
      { status: 500 }
    )
  }
}
