require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('../lib/db');

async function addBookingFields() {
    console.log('Adding guests and total_price columns to bookings table...');

    try {
        const turso = getTurso();

        // Add guests column
        try {
            await turso.execute(`ALTER TABLE bookings ADD COLUMN guests INTEGER DEFAULT 1;`);
            console.log('✓ guests column added');
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log('✓ guests column already exists');
            } else {
                console.log('Error adding guests column (might exist):', e.message);
            }
        }

        // Add total_price column
        try {
            await turso.execute(`ALTER TABLE bookings ADD COLUMN total_price REAL DEFAULT 0;`);
            console.log('✓ total_price column added');
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log('✓ total_price column already exists');
            } else {
                console.log('Error adding total_price column (might exist):', e.message);
            }
        }

        console.log('Migration complete!');
    } catch (error) {
        console.error('Error running migration:', error);
        process.exit(1);
    }
}

addBookingFields();
