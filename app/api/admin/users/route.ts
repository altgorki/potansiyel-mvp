import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = request.nextUrl;
  const search = url.searchParams.get('search') ?? '';
  const area = url.searchParams.get('area') ?? '';
  const candidateOnly = url.searchParams.get('candidate') === '1';

  let query = 'SELECT * FROM users WHERE 1=1';
  const queryParams: unknown[] = [];

  if (search) {
    query += ' AND name LIKE ?';
    queryParams.push(`%${search}%`);
  }
  if (candidateOnly) {
    query += ' AND is_candidate = 1';
  }

  query += ' ORDER BY created_at DESC';
  const users = db.prepare(query).all(...queryParams) as Array<Record<string, unknown>>;

  const result = users.map(u => {
    let scores = db.prepare('SELECT * FROM user_scores WHERE user_id = ?').all(u.id as number) as Array<Record<string, unknown>>;
    if (area) {
      scores = scores.filter(s => (s as { area_key: string }).area_key === area);
    }
    const openAnswers = db.prepare(
      "SELECT * FROM quiz_answers WHERE user_id = ? AND answer_type = 'open_ended'"
    ).all(u.id as number);
    return { ...u, scores, open_answers: openAnswers };
  });

  // If area filter, only return users who have scores in that area
  const filtered = area ? result.filter(u => u.scores.length > 0) : result;

  return Response.json(filtered);
}
