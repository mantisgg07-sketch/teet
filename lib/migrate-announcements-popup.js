// Migration script to add 'type' and 'image_url' columns to announcements table
require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('./db');

async function migrateAnnouncementsTable() {
  console.log('Starting announcements table migration...');

  try {
    const turso = getTurso();

    // Add 'type' column (default 'banner' for existing rows)
    try {
      await turso.execute(`
        ALTER TABLE announcements ADD COLUMN type TEXT DEFAULT 'banner'
      `);
      console.log('[OK] Added "type" column to announcements table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('[WARN] Column "type" already exists, skipping');
      } else {
        throw error;
      }
    }

    // Add 'image_url' column (nullable)
    try {
      await turso.execute(`
        ALTER TABLE announcements ADD COLUMN image_url TEXT
      `);
      console.log('[OK] Added "image_url" column to announcements table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('[WARN] Column "image_url" already exists, skipping');
      } else {
        throw error;
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateAnnouncementsTable();
