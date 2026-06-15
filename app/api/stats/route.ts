import { count } from 'drizzle-orm';

import { db } from '@/lib/db';
import { shipEvents } from '@/drizzle/schema/schema';

/**
 * Public aggregate for the hero counter. Cached at the edge so the hero never
 * hits the database on every render.
 */
export const runtime = 'edge';

export async function GET(): Promise<Response> {
  let shipped = 0;
  try {
    const [row] = await db.select({ n: count() }).from(shipEvents);
    shipped = row?.n ?? 0;
  } catch {
    // Telemetry table not migrated yet / db unavailable — show 0, never 500.
  }
  return Response.json(
    { shipped },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
