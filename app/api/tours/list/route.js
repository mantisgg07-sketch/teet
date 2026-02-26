import { NextResponse } from 'next/server'
import { getDb } from '@/lib/turso'
import { tours as toursSchema } from '@/lib/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    try {
        const db = getDb();
        const result = await db.select({
            id: toursSchema.id,
            title: toursSchema.title,
            title_en: toursSchema.title_en,
            price: toursSchema.price,
            currency: toursSchema.currency,
            location: toursSchema.location,
            location_en: toursSchema.location_en,
            is_discount_active: toursSchema.is_discount_active,
            discount_percentage: toursSchema.discount_percentage,
        }).from(toursSchema).orderBy(desc(toursSchema.created_at));

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching tours list:', error)
        return NextResponse.json([], { status: 500 })
    }
}
