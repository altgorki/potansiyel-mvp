import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  db.prepare('INSERT INTO messages (group_id, user_id, content) VALUES (?, ?, ?)').run(
    Number(id), body.user_id, body.content
  );

  // Also add user to group if not already a member
  const existing = db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?').get(Number(id), body.user_id);
  if (!existing) {
    db.prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)').run(Number(id), body.user_id);
    db.prepare('UPDATE groups SET member_count = member_count + 1 WHERE id = ?').run(Number(id));
  }

  return Response.json({ ok: true });
}
