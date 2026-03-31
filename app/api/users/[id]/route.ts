import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });

  const scores = db.prepare('SELECT * FROM user_scores WHERE user_id = ?').all(Number(id));
  const interests = db.prepare('SELECT * FROM user_interests WHERE user_id = ?').all(Number(id));

  return Response.json({ ...user as object, scores, interests });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  if (body.interests) {
    db.prepare('DELETE FROM user_interests WHERE user_id = ?').run(Number(id));
    const insert = db.prepare('INSERT INTO user_interests (user_id, area_key) VALUES (?, ?)');
    for (const key of body.interests) {
      insert.run(Number(id), key);
    }
    return Response.json({ ok: true });
  }

  if (body.name !== undefined) {
    db.prepare('UPDATE users SET name = ?, age = ?, city = ?, bio = ? WHERE id = ?').run(
      body.name, body.age ?? null, body.city ?? null, body.bio ?? null, Number(id)
    );
  }

  return Response.json({ ok: true });
}
