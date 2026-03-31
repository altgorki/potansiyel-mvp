import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(Number(id));
  if (!group) return Response.json({ error: 'Not found' }, { status: 404 });

  const members = db.prepare(
    'SELECT u.* FROM users u JOIN group_members gm ON u.id = gm.user_id WHERE gm.group_id = ?'
  ).all(Number(id));

  const messages = db.prepare(
    'SELECT m.*, u.name as user_name FROM messages m JOIN users u ON m.user_id = u.id WHERE m.group_id = ? ORDER BY m.created_at ASC'
  ).all(Number(id));

  const events = db.prepare(
    'SELECT * FROM events WHERE group_id = ? ORDER BY event_date ASC'
  ).all(Number(id));

  return Response.json({ ...group as object, members, messages, events });
}
