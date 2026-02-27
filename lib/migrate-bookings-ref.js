// Fixed - reads .env.local (how Next.js works)
require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('./db');

// Helper to generate a random alphanumeric string (e.g. A8F2K)
function generateRefCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars (I, 1, O, 0)
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `GH-${result}`;
}

async function migrateBookings() {
    console.log('Starting Bookings Reference Code Migration...');

    try {
        const turso = getTurso();

        // 1. Check if reference_code column exists
        const bookInfo = await turso.execute('PRAGMA table_info(bookings)');
        const bookCols = bookInfo.rows.map(r => r.name);

        if (!bookCols.includes('reference_code')) {
            console.log('Adding reference_code column to bookings table...');
            await turso.execute('ALTER TABLE bookings ADD COLUMN reference_code TEXT');
        } else {
            console.log('Column reference_code already exists.');
        }

        // 2. Fetch all bookings that don't have a reference code
        console.log('Fetching bookings without reference codes...');
        const bookings = await turso.execute('SELECT id FROM bookings WHERE reference_code IS NULL');

        if (bookings.rows.length === 0) {
            console.log('[OK] All bookings already have reference codes.');
            process.exit(0);
        }

        console.log(`Found ${bookings.rows.length} bookings to update.`);

        // 3. Update each booking with a unique reference code
        for (const row of bookings.rows) {
            let uniqueCode = generateRefCode();
            let isUnique = false;

            // Simple loop to ensure absolute uniqueness before saving
            while (!isUnique) {
                try {
                    await turso.execute({
                        sql: 'UPDATE bookings SET reference_code = ? WHERE id = ?',
                        args: [uniqueCode, row.id]
                    });
                    console.log(`[UPDATED] Booking ID ${row.id} -> ${uniqueCode}`);
                    isUnique = true;
                } catch (err) {
                    if (err.message && err.message.includes('UNIQUE constraint failed')) {
                        console.log(`Collision detected for ${uniqueCode}, generating a new one...`);
                        uniqueCode = generateRefCode();
                    } else {
                        throw err;
                    }
                }
            }
        }

        console.log('[OK] Booking reference code migration successfully completed!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateBookings();
