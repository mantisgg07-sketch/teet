import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { getTurso } from '@/lib/turso'
import EditTourForm from './EditTourForm'

async function getTour(id) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM tours WHERE id = ?',
      args: [id]
    });
    const row = result.rows[0] || null;
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
