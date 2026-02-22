import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { announcements as announcementsSchema } from '@/lib/schema'
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

    const { id, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const db = getDb();

    await db.update(announcementsSchema)
      .set({ is_active: is_active ? 1 : 0 })
      .where(eq(announcementsSchema.id, id));

    revalidatePath('/admin/announcements')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle announcement error:', error)
    return NextResponse.json(
      { error: 'An error occurred while toggling the announcement' },
      { status: 500 }
    )
  }
}
