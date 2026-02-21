# Quick Start Guide - GoHoliday

This guide will help you get the GoHoliday website up and running in 5 minutes.

## Step 1: Clone and Install (1 minute)

```bash
# Clone the repository
git clone <repository-url>
cd Codespace

# Install dependencies
npm install
```

## Step 2: Set Up Turso Database (2 minutes)

### Create a Turso Database

```bash
# Install Turso CLI (if not installed)
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create goholiday

# Get database URL
turso db show goholiday --url

# Create auth token
turso db tokens create goholiday
```

Copy both the URL and token - you'll need them in the next step.

## Step 3: Configure Environment Variables (1 minute)

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your values:

```env
# Required for database
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Optional for image uploads (can skip for initial testing)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Admin credentials
ADMIN_EMAIL=admin@goholiday.com
ADMIN_PASSWORD=your_secure_password_here

# Session secret (generate a random 32+ character string)
SESSION_SECRET=change_this_to_a_random_32_character_or_longer_secret
```

### Generate a Session Secret

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Step 4: Initialize Database (30 seconds)

```bash
# Create tables and admin user
npm run init-db
```

You should see:
```
✓ Tours table created
✓ Announcements table created
✓ Admins table created
✓ Default admin created: admin@goholiday.com
Database initialization complete!
```

## Step 5: Start the Application (30 seconds)

```bash
# Start development server
npm run dev
```

Open your browser to: [http://localhost:3000](http://localhost:3000)

## First Steps After Launch

### Access the Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with:
   - **Email**: admin@goholiday.com (or your ADMIN_EMAIL)
   - **Password**: The password you set in ADMIN_PASSWORD

### Add Your First Tour

1. Click "Add New Tour" button
2. Fill in the tour details:
   - Title: "Amazing Beach Paradise"
   - Description: "Enjoy pristine beaches and crystal clear waters..."
   - Price: 1299.99
   - Duration: "5 Days / 4 Nights"
   - Dates: "Year-round"
   - Location: "Maldives"
3. Add images (if Cloudinary is configured) or manually enter image URLs
4. Click "Create Tour"

### Add an Announcement (Optional)

1. Go to "Announcements" in the admin menu
2. Enter a message: "🎉 Special Offer: 20% off on all beach tours!"
3. Check "Set as Active"
4. Click "Create Announcement"
5. Visit the homepage to see it displayed

## Cloudinary Setup (Optional)

If you want to use the image upload feature:

1. Sign up at [https://cloudinary.com](https://cloudinary.com) (free tier available)
2. From your Cloudinary dashboard:
   - Copy your "Cloud name"
   - Go to Settings > Upload
   - Create or edit an upload preset named "ml_default"
   - Set it to "Unsigned"
3. Add to your `.env`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   ```

## Testing the Website

1. **Homepage**: [http://localhost:3000](http://localhost:3000)
   - Should show hero section
   - Your announcement banner (if active)
   - Featured tours section

2. **Tours Page**: [http://localhost:3000/tours](http://localhost:3000/tours)
   - Grid of all tour packages

3. **Admin Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
   - Statistics
   - Tour management table

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Database not configured" error
- Make sure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set in `.env`
- Restart the dev server after changing `.env`

### "Session secret" errors
- Make sure SESSION_SECRET is at least 32 characters
- Generate a new one using the command in Step 3

### Build errors
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

## Production Deployment

See the main [README.md](README.md) for detailed deployment instructions for:
- Vercel
- Other platforms

## Next Steps

1. Customize the design in `app/globals.css`
2. Add more tours from the admin panel
3. Customize the homepage text in `app/page.js`
4. Set up Cloudinary for image uploads
5. Deploy to production

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the code comments in each file
- Open an issue on GitHub

---

**Congratulations!** 🎉 You now have a fully functional travel website running!
