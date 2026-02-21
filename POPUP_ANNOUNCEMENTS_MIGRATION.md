# Pop-up Announcements Feature - Migration Guide

## Overview
This feature adds support for pop-up announcements with image support, providing a more engaging way to communicate with users.

## Database Migration

### Step 1: Run the Migration Script
The migration adds two new columns to the `announcements` table:
- `type` (TEXT, default 'banner') - Determines if the announcement is a banner or pop-up
- `image_url` (TEXT, nullable) - Optional image URL for pop-up announcements

To run the migration:

```bash
npm run migrate-announcements-popup
```

### Step 2: Verify Migration
After running the migration, verify the changes:

```bash
# Using Turso CLI
turso db shell your-database-name

# Check the announcements table schema
.schema announcements
```

You should see the new `type` and `image_url` columns in the table.

## Features

### Admin Panel (`/admin/announcements`)
- **Display Type Selector**: Choose between "Banner" (traditional top banner) or "Pop-up" (modal overlay)
- **Image Upload**: When "Pop-up" is selected, an image upload field appears
- **Image Support**: Upload images via Cloudinary or provide direct image URLs
- **Announcement List**: Updated to show announcement type with visual badges

### Public Site
- **Banner Announcements**: Traditional banner at the top of the page
- **Pop-up Announcements**: 
  - Professional modal with blurred backdrop
  - Optional top image
  - Animated slide-up entrance
  - Dismiss button with "Got it!" text
  - Smart dismissal logic using localStorage (won't show again for 24 hours)
  - Responsive design for all screen sizes

## Usage

### Creating a Banner Announcement
1. Go to `/admin/announcements`
2. Enter your message
3. Select "Banner" as the display type
4. Check "Set as Active" if you want it to display immediately
5. Click "Create Announcement"

### Creating a Pop-up Announcement
1. Go to `/admin/announcements`
2. Enter your message
3. Select "Pop-up" as the display type
4. (Optional) Upload or provide an image URL for the top of the pop-up
5. Check "Set as Active" if you want it to display immediately
6. Click "Create Announcement"

## Technical Details

### Files Modified
- `lib/migrate-announcements-popup.js` - Database migration script
- `app/admin/announcements/AnnouncementForm.js` - Added type selector and image upload
- `app/admin/announcements/AnnouncementList.js` - Display announcement type
- `app/api/announcements/create/route.js` - Handle new fields
- `components/AnnouncementPopup.js` - New pop-up component (NEW)
- `app/[lang]/page.js` - Conditional rendering based on type
- `package.json` - Added migration script

### Pop-up Dismissal Logic
The pop-up uses localStorage to track when a user dismisses an announcement:
- Stores the announcement ID and dismissal timestamp
- Won't show the same announcement for 24 hours after dismissal
- Will show new announcements (different ID) immediately
- Resets after 24 hours, allowing re-display of important messages

### Styling
- Uses Tailwind CSS for consistent styling
- Backdrop blur effect for professional appearance
- Smooth animations (slide-up on entrance, fade-out on exit)
- Fully responsive design
- Accessible with proper ARIA labels

## Multilingual Support
The feature maintains full multilingual support:
- Messages are automatically translated to Thai and Chinese
- Pop-ups display the correct language based on user's selection
- Works seamlessly with existing i18n implementation

## Testing
After migration, test the following:
1. Create a banner announcement and verify it displays as a banner
2. Create a pop-up announcement without an image
3. Create a pop-up announcement with an image
4. Dismiss a pop-up and verify it doesn't show again on refresh
5. Test on mobile and desktop devices
6. Test language switching with active announcements

## Troubleshooting

### Migration fails with "column already exists"
This is safe to ignore - it means the migration has already been run.

### Pop-up doesn't show
- Verify the announcement is set as "Active"
- Check browser console for localStorage issues
- Clear localStorage and refresh: `localStorage.removeItem('dismissedAnnouncementId')`

### Image doesn't display
- Verify the image URL is valid and accessible
- Check that the image URL is saved in the database
- Ensure the image URL uses HTTPS (required by Next.js Image component)

## Notes
- Only one announcement can be active at a time (banner or pop-up)
- Existing announcements without a `type` field will default to 'banner'
- Image uploads work with or without Cloudinary configuration
- Pop-ups are designed to be non-intrusive and user-friendly
