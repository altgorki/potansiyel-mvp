'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS, AREAS } from '@/lib/constants';
import { getUserId } from '@/lib/session';
import { Question } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import MultipleChoice from './MultipleChoice';
import LikertScale from './LikertScale';
import OpenEnded from './OpenEnded';

export default function QuizStepper() {
  const router = useRouter();
  const [interests, setInterests] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { router.push('/olustur'); return; }
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        const areaKeys: string[] = data.interests?.map((i: { area_key: string }) => i.area_key) ?? [];
        setInterests(areaKeys);
        setQuestions(QUESTIONS.filter(q => areaKeys.includes(q.area_key)));
      });
  }, [router]);

  const q = questions[current];
  if (!q) return <div className="text-center text-muted">Yukleniyor...</div>;

  const area = AREAS.find(a => a.key === q.area_key);
  const answer = answers[q.id] ?? '';

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setLoading(true);
      const userId = getUserId();
      const submission = questions.map(qq => ({
        question_id: qq.id,
        area_key: qq.area_key,
        answer_type: qq.type,
        answer_value: answers[qq.id] ?? '',
      }));
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, answers: submission }),
      });
      router.push('/sonuc');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>{area?.icon} {area?.name}</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <ProgressBar value={current + 1} max={questions.length} />
      </div>

      <Card className="mb-6 fade-in" key={q.id}>
        <h3 className="text-lg font-medium mb-6">{q.text}</h3>
        {q.type === 'multiple_choice' && <MultipleChoice question={q} value={answer} onChange={v => setAnswers(p => ({ ...p, [q.id]: v }))} />}
        {q.type === 'likert' && <LikertScale value={answer} onChange={v => setAnswers(p => ({ ...p, [q.id]: v }))} />}
        {q.type === 'open_ended' && <OpenEnded value={answer} onChange={v => setAnswers(p => ({ ...p, [q.id]: v }))} />}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          Geri
        </Button>
        <Button onClick={handleNext} disabled={!answer || loading}>
          {loading ? 'Hesaplanıyor...' : current < questions.length - 1 ? 'Sonraki' : 'Tamamla'}
        </Button>
      </div>
    </div>
  );
}
