import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const db = getDb();
  db.prepare('UPDATE users SET is_candidate = ? WHERE id = ?').run(
    body.is_candidate ? 1 : 0,
    body.user_id
  );
  return Response.json({ ok: true });
}
