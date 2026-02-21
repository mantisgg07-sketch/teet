# Quick Start Guide - Pop-up Announcements

## 🎯 What This Feature Does

Adds support for beautiful pop-up announcements with images, providing a modern way to communicate important messages to users.

## 🚀 Quick Start (3 Steps)

### Step 1: Run Migration
```bash
npm run migrate-announcements-popup
```

### Step 2: Create a Pop-up
1. Go to `/admin/announcements`
2. Enter your message
3. Select "Pop-up" (not "Banner")
4. Upload an image (optional)
5. Check "Set as Active"
6. Click "Create Announcement"

### Step 3: Test
- Visit your home page
- You should see a beautiful pop-up after 0.5 seconds
- Click "Got it!" to dismiss
- Refresh the page - it won't show again for 24 hours

## 📸 Visual Preview

### Admin Panel
```
┌─────────────────────────────────────────┐
│ Message: Enter your announcement...    │
│                                         │
│ Display Type:                          │
│  ○ Banner    ● Pop-up                  │
│                                         │
│ [Upload Image] or enter URL            │
│                                         │
│ ☑ Set as Active                        │
│                                         │
│ [Create Announcement]                   │
└─────────────────────────────────────────┘
```

### Pop-up on Website
```
        [Blurred Background]
    ┌─────────────────────────┐
    │   [Optional Image]      │
    │                         │
    │     Announcement        │
    │                         │
    │  Your message here      │
    │                         │
    │  [Got it!]              │
    │                         │
    │  Won't show for 24hrs   │
    └─────────────────────────┘
```

## ✨ Features

✅ **Professional Design** - Blurred backdrop, smooth animations
✅ **Image Support** - Add eye-catching images to your announcements
✅ **Smart Dismissal** - Won't annoy users (24-hour cooldown)
✅ **Multilingual** - Works with English, Thai, and Chinese
✅ **Responsive** - Looks great on all devices
✅ **Accessible** - Screen reader friendly

## 🔄 Banner vs Pop-up

### Banner (Existing)
- Shows at top of page
- Always visible until dismissed
- No image support
- Less intrusive

### Pop-up (New)
- Modal overlay in center
- Appears after 0.5 seconds
- Image support
- More attention-grabbing
- Smart dismissal (24-hour cooldown)

## 📝 Examples

### Example 1: Special Offer
```
Type: Pop-up
Message: 🎉 Limited Time Offer! Book now and save 30% on all tours!
Image: https://example.com/special-offer.jpg
Active: Yes
```

### Example 2: New Feature
```
Type: Pop-up
Message: ✨ We've added new tours in Thailand! Check them out now.
Image: https://example.com/thailand-tours.jpg
Active: Yes
```

### Example 3: Simple Update
```
Type: Banner
Message: New payment methods available!
Active: Yes
```

## 🛠️ Customization

### Change Dismissal Duration
Edit `components/AnnouncementPopup.js`:
```javascript
// Current: 24 hours
Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000

// Example: 7 days
Date.now() - parseInt(dismissedAt) > 7 * 24 * 60 * 60 * 1000
```

### Clear Dismissal (For Testing)
In browser console:
```javascript
localStorage.removeItem('dismissedAnnouncementId')
localStorage.removeItem('dismissedAnnouncementAt')
```

## 📚 Full Documentation

- **POPUP_ANNOUNCEMENTS_SUMMARY.md** - Complete overview
- **POPUP_ANNOUNCEMENTS_MIGRATION.md** - Technical details
- **POPUP_ANNOUNCEMENTS_UI_GUIDE.md** - Visual walkthrough

## 🐛 Troubleshooting

**Pop-up not showing?**
- Check it's set as "Active"
- Clear localStorage and refresh
- Check browser console for errors

**Image not displaying?**
- Verify URL is valid and uses HTTPS
- Check image is publicly accessible
- Ensure Next.js Image domains are configured if needed

**Migration fails?**
- If "column already exists" - it's safe, already migrated
- Check database credentials in `.env.local`

## ✅ Success Checklist

- [ ] Migration ran successfully
- [ ] Created a pop-up announcement
- [ ] Pop-up displays on home page
- [ ] Image displays correctly (if added)
- [ ] Dismissal works (doesn't show after refresh)
- [ ] After 24 hours, pop-up can show again
- [ ] Works on mobile and desktop
- [ ] Banner announcements still work

## 🎊 You're Done!

The feature is now live and ready to use. Create engaging pop-up announcements to communicate with your users professionally!

---

**Need Help?** Check the full documentation files or review the code comments.
