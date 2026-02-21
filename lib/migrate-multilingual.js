// Database migration to add multilingual fields
require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('./db');

async function migrateToMultilingual() {
  console.log('Starting multilingual migration...');

  try {
    const turso = getTurso();
    
    // Check if columns already exist
    const tableInfo = await turso.execute('PRAGMA table_info(tours)');
    const existingColumns = tableInfo.rows.map(row => row.name);
    
    // Add multilingual columns to tours table if they don't exist
    const columnsToAdd = [
      'title_en TEXT',
      'title_th TEXT',
      'title_zh TEXT',
      'description_en TEXT',
      'description_th TEXT',
      'description_zh TEXT',
      'location_en TEXT',
      'location_th TEXT',
      'location_zh TEXT',
    ];
    
    for (const column of columnsToAdd) {
      const columnName = column.split(' ')[0];
      if (!existingColumns.includes(columnName)) {
        await turso.execute(`ALTER TABLE tours ADD COLUMN ${column}`);
        console.log(`✓ Added column: ${columnName}`);
      } else {
        console.log(`- Column already exists: ${columnName}`);
      }
    }
    
    // Migrate existing data to English fields
    console.log('\nMigrating existing data to English fields...');
    
    const tours = await turso.execute('SELECT id, title, description, location FROM tours');
    
    for (const tour of tours.rows) {
      if (tour.title && !tour.title_en) {
        await turso.execute({
          sql: 'UPDATE tours SET title_en = ?, description_en = ?, location_en = ? WHERE id = ?',
          args: [tour.title, tour.description, tour.location, tour.id]
        });
        console.log(`✓ Migrated tour #${tour.id} to English fields`);
      }
    }
    
    // Add multilingual columns to announcements table
    console.log('\nUpdating announcements table...');
    const announcementInfo = await turso.execute('PRAGMA table_info(announcements)');
    const announcementColumns = announcementInfo.rows.map(row => row.name);
    
    const announcementColumnsToAdd = [
      'message_en TEXT',
      'message_th TEXT',
      'message_zh TEXT',
    ];
    
    for (const column of announcementColumnsToAdd) {
      const columnName = column.split(' ')[0];
      if (!announcementColumns.includes(columnName)) {
        await turso.execute(`ALTER TABLE announcements ADD COLUMN ${column}`);
        console.log(`✓ Added column: ${columnName}`);
      } else {
        console.log(`- Column already exists: ${columnName}`);
      }
    }
    
    // Migrate existing announcements to English fields
    const announcements = await turso.execute('SELECT id, message FROM announcements');
    
    for (const announcement of announcements.rows) {
      if (announcement.message && !announcement.message_en) {
        await turso.execute({
          sql: 'UPDATE announcements SET message_en = ? WHERE id = ?',
          args: [announcement.message, announcement.id]
        });
        console.log(`✓ Migrated announcement #${announcement.id} to English field`);
      }
    }
    
    console.log('\n✅ Multilingual migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your tour creation forms to include all language fields');
    console.log('2. Add translations for existing tours in Thai and Mandarin');
    console.log('3. Test the language switching functionality');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

migrateToMultilingual();