import { createClient } from '@libsql/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env.local');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

function generateReferenceCode() {
    // Generate GH-XXXXXX format
    return 'GH-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

async function migrate() {
    try {
        console.log('Starting migration to add reference_code to bookings...');

        // 1. Add the column (allowing NULL initially for existing rows)
        try {
            await client.execute('ALTER TABLE bookings ADD COLUMN reference_code TEXT;');
            console.log('✓ Added reference_code column');
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log('ℹ reference_code column already exists');
            } else {
                throw e;
            }
        }

        // 2. Fetch all bookings that don't have a reference code
        const result = await client.execute('SELECT id FROM bookings WHERE reference_code IS NULL');

        if (result.rows.length > 0) {
            console.log(`Found ${result.rows.length} bookings needing reference codes. Backfilling...`);

            let updatedCount = 0;
            for (const row of result.rows) {
                let code = generateReferenceCode();
                let success = false;

                // Ensure uniqueness (simple retry logic)
                while (!success) {
                    try {
                        await client.execute({
                            sql: 'UPDATE bookings SET reference_code = ? WHERE id = ?',
                            args: [code, row.id]
                        });
                        success = true;
                        updatedCount++;
                    } catch (e) {
                        if (e.message.includes('UNIQUE constraint failed')) {
                            code = generateReferenceCode(); // Try again
                        } else {
                            throw e;
                        }
                    }
                }
            }
            console.log(`✓ Successfully generated specific codes for ${updatedCount} old entries`);
        } else {
            console.log('✓ No existing bookings need backfilling.');
        }

        // 3. Create Unique Index
        try {
            await client.execute('CREATE UNIQUE INDEX idx_bookings_reference_code ON bookings(reference_code);');
            console.log('✓ Added unique index for reference_code');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('ℹ unique index already exists');
            } else {
                throw e;
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
