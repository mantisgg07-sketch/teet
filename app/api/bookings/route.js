import { NextResponse } from 'next/server';
import { getTurso } from '@/lib/turso';
import { isAuthenticated } from '@/lib/auth';

// Valid booking status values
const VALID_STATUSES = ['pending', 'confirmed', 'cancelled'];

// Helper to validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST — public (customers submit bookings)
export async function POST(request) {
    try {
        const body = await request.json();
        const { tour_id, user_id, name, email, phone, contact_method, message } = body;

        // Validate required fields
        if (!tour_id || !name || !email || !phone || !contact_method) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const safeName = String(name).trim().slice(0, 200);
        const safeEmail = String(email).trim().slice(0, 200);
        const safePhone = String(phone).trim().slice(0, 50);
        const safeMessage = message ? String(message).trim().slice(0, 2000) : '';
        const safeGuests = Math.max(1, Math.min(100, parseInt(body.guests) || 1));
        const safeTotalPrice = Math.max(0, parseFloat(body.total_price) || 0);

        const turso = getTurso();

        await turso.execute({
            sql: `INSERT INTO bookings (tour_id, user_id, name, email, phone, contact_method, message, guests, total_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [tour_id, user_id || null, safeName, safeEmail, safePhone, contact_method, safeMessage, safeGuests, safeTotalPrice]
        });

        return NextResponse.json(
            { success: true, message: 'Booking submitted successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Booking submission error:', error.message);
        return NextResponse.json(
            { error: 'Failed to submit booking' },
            { status: 500 }
        );
    }
}

// GET — admin only (returns customer PII)
export async function GET(request) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const turso = getTurso();
        const result = await turso.execute('SELECT * FROM bookings ORDER BY created_at DESC');

        const bookings = result.rows.map(row => {
            return JSON.parse(JSON.stringify(row));
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

// PUT — admin only (update status/notes)
export async function PUT(request) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, status, admin_note } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing ID' },
                { status: 400 }
            );
        }

        if (!status && admin_note === undefined) {
            return NextResponse.json(
                { error: 'No update data provided (status or admin_note)' },
                { status: 400 }
            );
        }

        // Validate status against whitelist
        if (status && !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
                { status: 400 }
            );
        }

        const turso = getTurso();
        const updates = [];
        const args = [];

        if (status) {
            updates.push('status = ?');
            args.push(status);
        }

        if (admin_note !== undefined) {
            // Sanitize admin note
            const safeNote = String(admin_note).trim().slice(0, 5000);
            updates.push('admin_note = ?');
            args.push(safeNote);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        args.push(id);

        const sql = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;

        await turso.execute({
            sql: sql,
            args: args
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating booking:', error.message);
        return NextResponse.json(
            { error: 'Failed to update booking' },
            { status: 500 }
        );
    }
}
