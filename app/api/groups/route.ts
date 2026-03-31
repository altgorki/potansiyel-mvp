import { getDb } from '@/db/database';

export async function GET() {
  const db = getDb();
  const groups = db.prepare('SELECT * FROM groups ORDER BY member_count DESC').all();
  return Response.json(groups);
}
