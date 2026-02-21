# Pop-up Announcements Feature - UI Screenshots & Walkthrough

## Admin Panel Interface

### Create Announcement Form

The admin panel now includes enhanced announcement creation with the following fields:

```
┌────────────────────────────────────────────────────────────┐
│ Add New Announcement                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Message *                                                  │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Enter announcement message...                      │   │
│ │                                                    │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ Display Type *                                             │
│ ○ Banner    ● Pop-up                                      │
│                                                            │
│ Pop-up Image (Optional)                                    │
│ ┌────────────────────────────────────────────────────┐   │
│ │  [Upload Image]  or  Enter image URL               │   │
│ │  ┌──────────────────────────────────────┐         │   │
│ │  │                                      │         │   │
│ │  │      Image Preview (if uploaded)     │         │   │
│ │  │                                      │         │   │
│ │  └──────────────────────────────────────┘         │   │
│ │  Add an eye-catching image to display at the      │   │
│ │  top of the pop-up announcement.                  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ ☑ Set as Active (Only one announcement can be active)    │
│                                                            │
│ [Create Announcement]                                      │
└────────────────────────────────────────────────────────────┘
```

### Announcements List

The announcements list now displays the type with visual badges:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ All Announcements                                                           │
├──────────────────────────────┬──────────┬──────────┬────────────┬──────────┤
│ Message                      │ Type     │ Status   │ Created    │ Actions  │
├──────────────────────────────┼──────────┼──────────┼────────────┼──────────┤
│ 🎉 Special Offer: Book your  │ 🔔 Pop-up│ Active   │ 2/18/2026  │ [Deact…] │
│ dream vacation now!          │ (Purple) │ (Green)  │            │ [Delete] │
├──────────────────────────────┼──────────┼──────────┼────────────┼──────────┤
│ New tours available in       │ 📢 Banner│ Inactive │ 2/15/2026  │ [Activ…] │
│ Thailand!                    │ (Blue)   │ (Gray)   │            │ [Delete] │
└──────────────────────────────┴──────────┴──────────┴────────────┴──────────┘
```

## Public Site Interface

### Banner Announcement (type: 'banner')

Traditional banner at the top of the page:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📢  New tours available in Thailand!                               ✕       │
│  Blue gradient background with white text                                   │
└─────────────────────────────────────────────────────────────────────────────┘
[Header]
[Page Content...]
```

### Pop-up Announcement (type: 'popup')

Professional modal overlay with blurred backdrop:

```
                     [Blurred Page Background]
        ┌───────────────────────────────────────────┐
        │  ┌─────────────────────────────────┐  ✕  │
        │  │                                 │     │
        │  │   [Optional Image - Top Half]   │     │
        │  │                                 │     │
        │  └─────────────────────────────────┘     │
        │                                          │
        │              ┌──────┐                   │
        │              │  📢  │                   │
        │              └──────┘                   │
        │                                          │
        │           Announcement                   │
        │                                          │
        │  🎉 Special Offer: Book your dream      │
        │  vacation now and get 20% off!          │
        │                                          │
        │     ┌──────────────────────┐            │
        │     │      Got it!         │            │
        │     └──────────────────────────┘            │
        │                                          │
        │  This message won't show again for      │
        │  24 hours                                │
        └──────────────────────────────────────────┘
```

## Key Features Illustrated

### 1. Radio Button Selection
When you select "Pop-up", the image upload field appears instantly.
When you select "Banner", the image upload field is hidden.

### 2. Image Upload Component
- If Cloudinary is configured: Shows "Upload Images" button
- If Cloudinary is not configured: Shows text input for image URL
- Supports both methods seamlessly
- Preview shows uploaded/entered image
- Remove button appears on hover over the image

### 3. Pop-up Behavior
- **Entrance**: Slides up from bottom with fade-in animation (0.3s)
- **Backdrop**: Black overlay with blur effect for professional look
- **Dismissal**: 
  - Click "Got it!" button
  - Click outside the modal (on backdrop)
  - Click X button in top-right
- **Smart Persistence**: Uses localStorage to remember dismissal
  - Stores announcement ID and timestamp
  - Won't show same announcement for 24 hours
  - New announcements show immediately
  - Different browsers = different dismissal state

### 4. Responsive Design
- **Mobile**: Full-width modal with appropriate padding
- **Tablet**: Slightly constrained width for better readability
- **Desktop**: Maximum width of 512px (max-w-lg), centered

### 5. Accessibility
- Proper ARIA labels (`role="dialog"`, `aria-modal="true"`)
- Keyboard accessible (focus management)
- Screen reader friendly
- Clear visual hierarchy

## Color Scheme

### Admin Panel
- **Pop-up Badge**: Purple background (#f3e8ff) with purple text (#7c3aed)
- **Banner Badge**: Blue background (#dbeafe) with blue text (#1e40af)
- **Active Status**: Green background (#dcfce7) with green text (#16a34a)
- **Inactive Status**: Gray background (#f3f4f6) with gray text (#374151)

### Public Site
- **Pop-up Modal**: White (#ffffff) with shadow
- **Backdrop**: Black with 50% opacity and blur
- **Icon Circle**: Cyan gradient (#e0f2fe to #bae6fd)
- **Button**: Cyan gradient (#0891b2 to #0e7490)
- **Close Button**: White/gray with hover effects

## User Experience Flow

### Creating a Pop-up Announcement:
1. Admin goes to `/admin/announcements`
2. Enters message text
3. Selects "Pop-up" radio button
4. (Optional) Uploads or enters image URL
5. Checks "Set as Active"
6. Clicks "Create Announcement"
7. Page refreshes and shows new announcement in list

### User Sees Pop-up:
1. User visits home page
2. After 0.5 second delay, pop-up slides up
3. User reads message and image (if present)
4. User clicks "Got it!" to dismiss
5. localStorage saves dismissal (ID + timestamp)
6. User refreshes page → pop-up doesn't show
7. After 24 hours → pop-up can show again

### Creating a Banner Announcement:
1. Same as pop-up, but select "Banner" instead
2. No image field appears
3. Creates traditional top banner
4. Shows immediately when user visits page
5. Can be dismissed with X button
6. No localStorage persistence (shows every time)

## Technical Implementation Details

### Files Structure
```
app/
├── admin/
│   └── announcements/
│       ├── AnnouncementForm.js (✓ Updated with type selector & image upload)
│       ├── AnnouncementList.js (✓ Updated to show type badges)
│       └── page.js (existing)
├── api/
│   └── announcements/
│       └── create/
│           └── route.js (✓ Updated to handle type & image_url)
└── [lang]/
    └── page.js (✓ Updated with conditional rendering)

components/
├── AnnouncementBanner.js (existing)
└── AnnouncementPopup.js (✓ NEW - Pop-up modal component)

lib/
├── migrate-announcements-popup.js (✓ NEW - Migration script)
└── turso.js (existing)
```

### Database Schema
```sql
CREATE TABLE announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  message_en TEXT,
  message_th TEXT,
  message_zh TEXT,
  is_active INTEGER DEFAULT 0,
  type TEXT DEFAULT 'banner',        -- NEW COLUMN
  image_url TEXT,                     -- NEW COLUMN
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### State Management (AnnouncementForm.js)
```javascript
const [type, setType] = useState('banner')       // 'banner' or 'popup'
const [imageUrl, setImageUrl] = useState('')     // Image URL for popup
```

### Conditional Rendering (page.js)
```javascript
{announcement && announcement.type === 'banner' && (
  <AnnouncementBanner message={localizedMessage} />
)}

{announcement && announcement.type === 'popup' && (
  <AnnouncementPopup announcement={{...announcement, message: localizedMessage}} />
)}
```

## Maintenance & Updates

To update an announcement's type:
1. Currently: Delete old announcement and create new one
2. Future enhancement: Add edit functionality to admin panel

To change dismissal duration:
Change the hardcoded value in AnnouncementPopup.js:
```javascript
// Current: 24 hours
const dismissalDuration = 24 * 60 * 60 * 1000

// Example: 7 days
const dismissalDuration = 7 * 24 * 60 * 60 * 1000
```

To clear dismissal for testing:
```javascript
// In browser console:
localStorage.removeItem('dismissedAnnouncementId')
localStorage.removeItem('dismissedAnnouncementAt')
```
