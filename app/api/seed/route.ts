import { getDb } from '@/db/database';

export async function POST() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  return Response.json({ message: 'Seed verisi hazır', count: count.c });
}
