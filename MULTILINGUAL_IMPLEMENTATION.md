# Multilingual System Implementation Guide

This document explains the comprehensive multilingual (i18n) system implemented in the GoHoliday Next.js application.

## Overview

The application now supports three languages:
- **English (en)** - Default language
- **Thai (th)** - ไทย
- **Mandarin Chinese (zh)** - 中文

## Architecture

### 1. Route-Based Localization

All public-facing routes are now prefixed with a language code:
- `/en` - English version
- `/th` - Thai version  
- `/zh` - Mandarin Chinese version

**Route Structure:**
```
/[lang]                    → Home page
/[lang]/tours              → Tours listing
/[lang]/tours/[id]         → Tour detail page
/[lang]/login              → Login page
```

**Non-localized routes:**
```
/api/*                     → API routes (not localized)
/admin/*                   → Admin dashboard (not localized)
```

### 2. Middleware

**File:** `middleware.js`

The middleware automatically:
1. Detects user's preferred language from `Accept-Language` header
2. Checks for saved language preference in `NEXT_LOCALE` cookie
3. Redirects users from `/` to `/{lang}` (e.g., `/en`, `/th`, `/zh`)
4. Preserves query parameters during redirection
5. Sets a cookie to remember language preference for 1 year

### 3. Translation Infrastructure

**Files:**
- `lib/i18n.js` - Core i18n utilities
- `dictionaries/en.json` - English translations
- `dictionaries/th.json` - Thai translations
- `dictionaries/zh.json` - Mandarin Chinese translations

**Key Functions:**

```javascript
// Get translations for a specific locale
const dict = await getDictionary('en');

// Get localized field from database row
const title = getLocalizedField(tour, 'title', 'en');

// Replace locale in pathname
const newPath = replaceLocaleInPath('/en/tours', 'th'); // Returns '/th/tours'
```

### 4. Database Schema

The database schema has been extended to support multilingual content:

**Tours Table - New Columns:**
- `title_en`, `title_th`, `title_zh` - Localized titles
- `description_en`, `description_th`, `description_zh` - Localized descriptions
- `location_en`, `location_th`, `location_zh` - Localized locations

**Announcements Table - New Columns:**
- `message_en`, `message_th`, `message_zh` - Localized messages

**Migration:**
```bash
npm run migrate-multilingual
```

This script:
1. Adds multilingual columns to tours and announcements tables
2. Migrates existing data to English columns
3. Preserves all existing data

### 5. Components

#### Language Switcher
**File:** `components/LanguageSwitcher.js`

Displays a dropdown that allows users to switch between languages. Features:
- Shows current language with flag emoji
- Updates URL path while preserving the rest of the route
- Saves preference to cookie
- Mobile-responsive design

#### Updated Components for i18n:
- `Header.js` - Navigation with language switcher
- `Footer.js` - Localized footer links
- `TourCard.js` - Displays localized tour data
- `TourSearch.js` - Search with localized fields
- `TourDetailSidebar.js` - Localized tour details

### 6. Page Implementation

All pages in `app/[lang]/*` receive the `lang` parameter and translations:

```javascript
export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div>
      <Header lang={lang} dict={dict} />
      {/* Page content using dict translations */}
      <Footer lang={lang} dict={dict} />
    </div>
  );
}
```

### 7. SEO & Metadata

Each language has its own metadata:

```javascript
export async function generateMetadata({ params }) {
  const { lang } = await params;
  
  return {
    title: titles[lang],
    description: descriptions[lang],
  };
}
```

The `lang` attribute is dynamically set on the HTML element based on the current route.

## Usage Guide

### Adding New Translations

1. **Static UI Text:**
   - Add translation keys to `dictionaries/{en,th,zh}.json`
   - Use in components: `{dict.section.key}`

2. **Database Content:**
   - When creating/editing tours, provide content in all three languages
   - Use fields: `title_en`, `title_th`, `title_zh`, etc.
   - The system automatically displays the correct version based on `lang`

### Creating New Localized Pages

1. Create the page in `app/[lang]/your-page/page.js`
2. Extract `lang` from params
3. Load dictionary: `const dict = await getDictionary(lang)`
4. Fetch localized database content using `getLocalizedField()`
5. Pass `lang` and `dict` to components

Example:
```javascript
export default async function YourPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div>
      <Header lang={lang} dict={dict} />
      <h1>{dict.yourSection.title}</h1>
      <Footer lang={lang} dict={dict} />
    </div>
  );
}
```

### Testing

1. **Middleware Redirects:**
   - Visit `/` → should redirect to `/en` (or your browser's language)
   - Check that query params are preserved

2. **Language Switching:**
   - Use the language switcher in the header
   - Verify URL changes correctly (e.g., `/en/tours` → `/th/tours`)
   - Verify cookie is set (`NEXT_LOCALE`)

3. **Localized Content:**
   - Navigate to `/en/tours`, `/th/tours`, `/zh/tours`
   - Verify tour titles, descriptions, and locations are displayed in the correct language
   - Check fallback to English if translation is missing

4. **SEO:**
   - Check HTML lang attribute: `<html lang="en">`
   - Verify page titles and meta descriptions for each language

## Admin Tasks

### Adding a New Language

1. Add locale code to `lib/i18n.js`:
   ```javascript
   export const locales = ['en', 'th', 'zh', 'fr']; // Added French
   ```

2. Add locale configuration:
   ```javascript
   export const localeConfig = {
     // ...existing
     fr: {
       name: 'Français',
       flag: '🇫🇷',
       direction: 'ltr'
     }
   };
   ```

3. Create dictionary file: `dictionaries/fr.json`

4. Add database columns: `title_fr`, `description_fr`, `location_fr`, etc.

5. Update migration script to include new columns

### Removing Non-localized Routes

Old routes have been removed:
- ❌ `/page.js` (replaced by `/[lang]/page.js`)
- ❌ `/tours/*` (replaced by `/[lang]/tours/*`)
- ❌ `/login/*` (replaced by `/[lang]/login/*`)

API and admin routes remain in `/app/api/*` and `/app/admin/*`.

## Technical Details

### Static Generation

The `generateStaticParams` function in `app/[lang]/layout.js` ensures all three language versions are pre-rendered at build time:

```javascript
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
```

This generates:
- `/en` → English static page
- `/th` → Thai static page
- `/zh` → Mandarin static page

### Performance

- Translations are loaded only once per page
- Middleware runs on edge (fast redirects)
- Static pages are pre-rendered at build time
- Language cookie reduces unnecessary language detection

## Troubleshooting

### Issue: Language switcher doesn't work
- Check that `replaceLocaleInPath()` is correctly replacing the locale
- Verify cookie is being set (check browser DevTools → Application → Cookies)
- Ensure middleware is running (check Network tab for redirects)

### Issue: Content not translating
- Verify database columns exist (`title_en`, `title_th`, `title_zh`)
- Check if migration was run successfully
- Verify `getLocalizedField()` is being used in components
- Check if translations exist in dictionary files

### Issue: Build errors
- Ensure all pages in `app/[lang]/*` properly extract `lang` parameter
- Verify all components expecting `lang` and `dict` props receive them
- Check that dictionary JSON files are valid

## Future Enhancements

Potential improvements:
1. Add RTL support for Arabic/Hebrew
2. Implement client-side language detection
3. Add language-specific number/date formatting
4. Implement translation management system
5. Add automated translation API integration
6. Support for regional variants (en-US, en-GB, zh-CN, zh-TW)

## Support

For issues or questions about the multilingual system:
1. Check this documentation
2. Review the code in `lib/i18n.js`
3. Test with the middleware in `middleware.js`
4. Examine working examples in `app/[lang]/page.js`
