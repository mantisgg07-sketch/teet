// Fixed - reads .env.local (how Next.js works)
require('dotenv').config({ path: '.env.local' });
const { getTurso } = require('./db');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  console.log('Initializing database...');

  try {
    const turso = getTurso();

    // 1. Create tables if they don't exist
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        duration TEXT NOT NULL,
        dates TEXT NOT NULL,
        location TEXT NOT NULL,
        banner_image TEXT,
        image_urls TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference_code TEXT UNIQUE,
        tour_id INTEGER NOT NULL,
        user_id TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        contact_method TEXT NOT NULL,
        message TEXT,
        guests INTEGER DEFAULT 1,
        total_price REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        admin_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Add missing columns to existing tables (Migrations)
    console.log('Checking for missing columns...');

    // Tours table columns
    const toursInfo = await turso.execute('PRAGMA table_info(tours)');
    const toursCols = toursInfo.rows.map(r => r.name);

    const missingToursCols = {
      'title_en': 'TEXT', 'title_th': 'TEXT', 'title_zh': 'TEXT',
      'description_en': 'TEXT', 'description_th': 'TEXT', 'description_zh': 'TEXT',
      'location_en': 'TEXT', 'location_th': 'TEXT', 'location_zh': 'TEXT',
      'video_urls': "TEXT DEFAULT '[]'",
      'banner_image': 'TEXT', 'image_urls': "TEXT DEFAULT '[]'",
      'is_discount_active': "INTEGER DEFAULT 0", 'discount_percentage': 'REAL'
    };

    for (const [col, type] of Object.entries(missingToursCols)) {
      if (!toursCols.includes(col)) {
        console.log(`Adding ${col} to tours...`);
        await turso.execute(`ALTER TABLE tours ADD COLUMN ${col} ${type}`);
      }
    }

    // Announcements table columns
    const annInfo = await turso.execute('PRAGMA table_info(announcements)');
    const annCols = annInfo.rows.map(r => r.name);

    const missingAnnCols = {
      'message_en': 'TEXT', 'message_th': 'TEXT', 'message_zh': 'TEXT',
      'type': "TEXT DEFAULT 'banner'", 'popup_type': "TEXT DEFAULT 'general'",
      'discount_tour_id': 'INTEGER', 'discount_percentage': 'REAL',
      'image_url': 'TEXT'
    };

    for (const [col, type] of Object.entries(missingAnnCols)) {
      if (!annCols.includes(col)) {
        console.log(`Adding ${col} to announcements...`);
        await turso.execute(`ALTER TABLE announcements ADD COLUMN ${col} ${type}`);
      }
    }

    // Bookings table columns
    const bookInfo = await turso.execute('PRAGMA table_info(bookings)');
    const bookCols = bookInfo.rows.map(r => r.name);

    if (!bookCols.includes('reference_code')) {
      console.log('Adding reference_code to bookings...');
      await turso.execute('ALTER TABLE bookings ADD COLUMN reference_code TEXT UNIQUE');

      // We will backfill this dynamically in migrate-bookings-ref.js, 
      // but for sheer initialization safety, it is added.
    }

    // 3. Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goholiday.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await turso.execute({
      sql: 'SELECT * FROM admins WHERE email = ?',
      args: [adminEmail]
    });

    if (existingAdmin.rows.length === 0) {
      await turso.execute({
        sql: 'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
        args: [adminEmail, passwordHash]
      });
      console.log(`[OK] Default admin created: ${adminEmail}`);
    }

    console.log('[OK] Database initialization/migration complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
