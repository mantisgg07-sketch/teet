# Dynamic Currency Switching - Testing Guide

This guide provides comprehensive instructions for testing the dynamic currency switching feature.

## Prerequisites

1. Ensure the database is up to date:
   ```bash
   # For new databases:
   npm run init-db
   
   # For existing databases with tours:
   npm run migrate-currency
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Test Scenarios

### 1. Currency Switcher in Public Site

**Test:** Currency selection dropdown works correctly
- Navigate to the homepage or tours page
- Locate the currency switcher in the header/navigation
- Click on the dropdown
- Verify all currencies are listed:
  - $ USD - US Dollar
  - ₹ INR - Indian Rupee
  - ฿ THB - Thai Baht
  - Rs NPR - Nepali Rupee
- Select a different currency
- Verify the currency symbol changes in all displayed prices

**Expected Results:**
- All tour prices should update to show the converted amount
- Currency symbols should display correctly for each currency
- Price conversions should be reasonable (based on current exchange rates)

### 2. Admin - Add New Tour with Currency

**Test:** Admin can select currency when creating a tour
- Log in to admin panel
- Navigate to "Add New Tour"
- Fill in all tour details
- Locate the "Currency" dropdown next to the "Price" field
- Select a currency (e.g., THB for Thai Baht)
- Enter a price (e.g., 35000 for Thai Baht)
- Save the tour

**Expected Results:**
- Currency dropdown should be visible and populated with all options
- Tour should be created with the selected currency
- On the tours page, the price should be displayed and converted correctly

### 3. Admin - Edit Existing Tour Currency

**Test:** Admin can edit the currency of an existing tour
- Log in to admin panel
- Navigate to "Dashboard" or tour management
- Click "Edit" on an existing tour
- Check that the currency dropdown shows the tour's current currency
- Change the currency (e.g., from USD to INR)
- Update the price accordingly
- Save the changes

**Expected Results:**
- Current currency should be pre-selected in dropdown
- After saving, tour should display with new currency
- Price conversions on public site should reflect the new base currency

### 4. Admin Dashboard - Price Display

**Test:** Dashboard shows converted prices correctly
- Log in to admin panel
- Navigate to Dashboard
- Create tours with different base currencies (USD, INR, THB, etc.)
- Switch currency in the header currency switcher
- Verify prices in both table view and card view (mobile) update

**Expected Results:**
- All prices should convert based on selected currency
- Conversions should account for each tour's base currency
- Same tour should show different prices when switching currencies

### 5. Tour Detail Page - Price Conversion

**Test:** Individual tour pages show correct converted prices
- Navigate to a tour detail page
- Note the base currency of the tour
- Switch currency using the header switcher
- Verify the price updates in:
  - Main price display in sidebar
  - WhatsApp booking message (check link preview)

**Expected Results:**
- Price should convert accurately from base currency to selected currency
- WhatsApp message should include the converted price

### 6. Exchange Rate Resilience

**Test:** System handles API failures gracefully
- **Note:** This test requires temporarily blocking the exchange rate API
- If API is unavailable, system should use fallback rates:
  - INR: 83.12
  - THB: 34.50
  - NPR: 133.00

**Expected Results:**
- No errors or broken functionality when API fails
- Prices display using fallback rates
- Console may show warning about using fallback rates

### 7. Edge Cases

**Test:** System handles edge cases properly
- Create a tour without specifying currency (should default to USD)
- Try invalid currency values (system should fallback to USD)
- Test with very high prices (e.g., 999999)
- Test with decimal prices (e.g., 99.99)

**Expected Results:**
- Default currency (USD) is used when not specified
- Invalid currencies fall back to USD
- Large numbers format correctly with commas/separators
- Decimal prices convert and display appropriately

## API Testing

### Manual API Tests

1. **Create Tour with Currency:**
   ```bash
   curl -X POST http://localhost:3000/api/tours/create \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Tour",
       "description": "Test Description",
       "price": 35000,
       "currency": "THB",
       "duration": "3 Days",
       "dates": "All Year",
       "location": "Bangkok"
     }'
   ```

2. **Update Tour Currency:**
   ```bash
   curl -X POST http://localhost:3000/api/tours/update \
     -H "Content-Type: application/json" \
     -d '{
       "id": 1,
       "title": "Updated Tour",
       "description": "Updated Description",
       "price": 15000,
       "currency": "NPR",
       "duration": "5 Days",
       "dates": "All Year",
       "location": "Kathmandu"
     }'
   ```

## Automated Testing Checklist

- [ ] Currency symbols display correctly for all 7 currencies
- [ ] Exchange rates fetch successfully from API
- [ ] Fallback rates work when API unavailable
- [ ] Price conversions are mathematically correct
- [ ] Admin can create tours with any currency
- [ ] Admin can edit tour currency
- [ ] Dashboard shows converted prices
- [ ] Tour cards show converted prices
- [ ] Tour detail pages show converted prices
- [ ] WhatsApp booking includes converted price
- [ ] Currency selection persists during browsing
- [ ] No console errors during currency switching
- [ ] Mobile responsive design works for currency selector
- [ ] Build completes without errors
- [ ] Database migration runs successfully

## Known Limitations

1. Exchange rates refresh every hour (not real-time tick-by-tick)
2. Relies on external API (exchangerate-api.com) for live rates
3. Fallback rates may become outdated over time
4. Currency preference is not persisted across sessions (could be enhanced with localStorage)

## Troubleshooting

**Prices not updating:**
- Check browser console for errors
- Verify CurrencyProvider is wrapping the app
- Check that tours have valid currency values

**Exchange rates seem wrong:**
- Check if API is accessible
- Verify fallback rates are being used
- Check console for fetch errors

**Currency column missing error:**
- Run migration: `npm run migrate-currency`
- Or reinitialize database: `npm run init-db`

## Success Criteria

The implementation is successful if:
1. ✅ All 7 currencies display correctly
2. ✅ Price conversions work from any currency to any currency
3. ✅ Admin can set currency per tour
4. ✅ System gracefully handles API failures
5. ✅ No breaking changes to existing functionality
6. ✅ Build and deployment succeed
7. ✅ Performance is not negatively impacted
