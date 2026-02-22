import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { getDb } from '@/lib/turso'
import { tours as toursSchema } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import EditTourForm from './EditTourForm'

async function getTour(id) {
  try {
    const db = getDb();
    const result = await db.select().from(toursSchema).where(eq(toursSchema.id, Number(id)));
    const row = result[0] || null;
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export default async function EditTourPage({ params }) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin');
  }

  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    redirect('/admin/dashboard');
  }

  return <EditTourForm tour={tour} />;
}
