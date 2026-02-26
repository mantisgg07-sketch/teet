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

    const { id, is_active } = await request.json()

    const safeId = parseInt(id, 10);
    if (Number.isNaN(safeId) || safeId < 1) {
      return NextResponse.json(
        { error: 'Invalid announcement ID' },
        { status: 400 }
      )
    }

    const turso = getTurso();
    const newActiveValue = is_active ? 1 : 0;

    // If activating, enforce single-active constraint per type
    if (newActiveValue === 1) {
      // Get the type of the target announcement
      const targetResult = await turso.execute({
        sql: 'SELECT type FROM announcements WHERE id = ?',
        args: [safeId]
      });

      if (targetResult.rows.length > 0) {
        const targetType = targetResult.rows[0].type;

        // Deactivate all other announcements of the same type
        await turso.execute({
          sql: 'UPDATE announcements SET is_active = 0 WHERE type = ? AND id != ? AND is_active = 1',
          args: [targetType, safeId]
        });
      }
    }

    // Toggle the target announcement
    await turso.execute({
      sql: 'UPDATE announcements SET is_active = ? WHERE id = ?',
      args: [newActiveValue, safeId]
    });

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
