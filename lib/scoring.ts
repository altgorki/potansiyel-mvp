import { QUESTIONS, getTier } from './constants';

export function scoreAnswer(questionId: string, answerType: string, answerValue: string): number {
  if (answerType === 'multiple_choice') {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question?.options) return 0;
    const option = question.options.find(o => o.value === answerValue);
    return option?.score ?? 0;
  }

  if (answerType === 'likert') {
    const likertMap: Record<string, number> = { '1': 4, '2': 8, '3': 12, '4': 16, '5': 20 };
    return likertMap[answerValue] ?? 0;
  }

  if (answerType === 'open_ended') {
    const len = answerValue.length;
    if (len < 20) return 5;
    if (len <= 50) return 10;
    if (len <= 100) return 15;
    return 20;
  }

  return 0;
}

export function calculateAreaScore(answers: { question_id: string; answer_type: string; answer_value: string }[]): { score: number; tier: string } {
  const totalRaw = answers.reduce((sum, a) => sum + scoreAnswer(a.question_id, a.answer_type, a.answer_value), 0);
  const maxRaw = 120;
  const normalized = Math.round((totalRaw / maxRaw) * 100);
  const clamped = Math.min(100, Math.max(0, normalized));
  return { score: clamped, tier: getTier(clamped) };
}
