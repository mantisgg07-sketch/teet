# Currency Migration Guide

This document explains how to migrate existing databases to support the new dynamic currency switching feature.

## For Existing Databases

If you have an existing database with tours, you need to run the migration script to add the `currency` column to the `tours` table:

```bash
npm run migrate-currency
```

This script will:
1. Check if the `currency` column already exists
2. If not, add the `currency` column with default value 'USD'
3. Update all existing tours to use 'USD' as their currency

## For New Databases

If you're setting up a fresh database, simply run:

```bash
npm run init-db
```

The initialization script now includes the `currency` column in the tours table schema, so no migration is needed.

## Verifying the Migration

After running the migration, you can verify the changes by:
1. Logging into the admin panel
2. Editing an existing tour
3. You should see a currency selector dropdown next to the price field
4. The default currency should be set to USD for existing tours

## Supported Currencies

The following currencies are now supported:
- USD (US Dollar) - $
- INR (Indian Rupee) - ₹
- THB (Thai Baht) - ฿
- NPR (Nepali Rupee) - Rs

## Exchange Rates

The system fetches real-time exchange rates from `https://api.exchangerate-api.com/v4/latest/USD`. 

If the API is unavailable, the system falls back to hardcoded rates:
- INR: 83.12
- THB: 34.50
- NPR: 133.00

Exchange rates are refreshed every hour automatically.
