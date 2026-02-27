import { createClient } from '@libsql/client';
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

async function migrate() {
    try {
        console.log('Starting migration to add categories tables...');

        // 1. Create categories table
        try {
            await client.execute(`
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_en TEXT,
            name_th TEXT,
            name_zh TEXT,
            slug TEXT NOT NULL UNIQUE,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log('✓ Created categories table');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('ℹ categories table already exists');
            } else {
                throw e;
            }
        }

        // 2. Create tour_categories joint table
        try {
            await client.execute(`
        CREATE TABLE tour_categories (
            tour_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (tour_id, category_id)
        );
      `);
            console.log('✓ Created tour_categories table');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('ℹ tour_categories table already exists');
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
