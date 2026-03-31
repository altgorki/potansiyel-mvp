import { NextRequest } from 'next/server';
import { getDb } from '@/db/database';
import { scoreAnswer, calculateAreaScore } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, answers } = body;
  const db = getDb();

  // Clear previous answers
  db.prepare('DELETE FROM quiz_answers WHERE user_id = ?').run(user_id);
  db.prepare('DELETE FROM user_scores WHERE user_id = ?').run(user_id);

  // Insert answers with scores
  const insertAnswer = db.prepare(
    'INSERT INTO quiz_answers (user_id, area_key, question_id, answer_type, answer_value, score) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const ans of answers) {
    const score = scoreAnswer(ans.question_id, ans.answer_type, ans.answer_value);
    insertAnswer.run(user_id, ans.area_key, ans.question_id, ans.answer_type, ans.answer_value, score);
  }

  // Calculate and store area scores
  const areaGroups: Record<string, typeof answers> = {};
  for (const ans of answers) {
    if (!areaGroups[ans.area_key]) areaGroups[ans.area_key] = [];
    areaGroups[ans.area_key].push(ans);
  }

  const insertScore = db.prepare(
    'INSERT OR REPLACE INTO user_scores (user_id, area_key, score, tier) VALUES (?, ?, ?, ?)'
  );

  const results: Record<string, { score: number; tier: string }> = {};
  for (const [areaKey, areaAnswers] of Object.entries(areaGroups)) {
    const { score, tier } = calculateAreaScore(areaAnswers);
    insertScore.run(user_id, areaKey, score, tier);
    results[areaKey] = { score, tier };
  }

  return Response.json({ ok: true, results });
}
