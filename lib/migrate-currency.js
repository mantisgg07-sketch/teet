// Migration script to add currency column to existing tours table
require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('./db');

async function migrateCurrencyColumn() {
  console.log('Starting currency column migration...');

  try {
    const turso = getTurso();

    // Check if currency column already exists
    const tableInfo = await turso.execute('PRAGMA table_info(tours)');
    const currencyColumnExists = tableInfo.rows.some(row => row.name === 'currency');

    if (currencyColumnExists) {
      console.log('[OK] Currency column already exists, no migration needed');
      return;
    }

    // Add currency column with default value 'USD'
    await turso.execute('ALTER TABLE tours ADD COLUMN currency TEXT DEFAULT "USD"');
    console.log('[OK] Currency column added successfully');

    // Update existing records to have USD as default
    await turso.execute('UPDATE tours SET currency = "USD" WHERE currency IS NULL');
    console.log('[OK] Existing tours updated with USD currency');

    console.log('Migration complete!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateCurrencyColumn();
