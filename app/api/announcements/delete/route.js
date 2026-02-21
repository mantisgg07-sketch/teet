import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTurso } from '@/lib/turso'
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

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const turso = getTurso();
    await turso.execute({
      sql: 'DELETE FROM announcements WHERE id = ?',
      args: [id]
    });

    revalidatePath('/admin/announcements')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete announcement error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the announcement' },
      { status: 500 }
    )
  }
}
