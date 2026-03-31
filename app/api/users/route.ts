import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = getDb();
  const result = db.prepare('INSERT INTO users (name, age, city, bio) VALUES (?, ?, ?, ?)').run(
    body.name, body.age ?? null, body.city ?? null, body.bio ?? null
  );
  return Response.json({ id: result.lastInsertRowid });
}

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = request.nextUrl;
  const search = url.searchParams.get('search');

  let users;
  if (search) {
    users = db.prepare('SELECT * FROM users WHERE name LIKE ? ORDER BY created_at DESC').all(`%${search}%`);
  } else {
    users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  }

  // Attach scores
  const usersWithScores = (users as Array<Record<string, unknown>>).map(u => {
    const scores = db.prepare('SELECT * FROM user_scores WHERE user_id = ?').all(u.id as number);
    const interests = db.prepare('SELECT * FROM user_interests WHERE user_id = ?').all(u.id as number);
    return { ...u, scores, interests };
  });

  return Response.json(usersWithScores);
}
