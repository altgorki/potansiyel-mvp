'use client';

import { QuizAnswer, User } from '@/lib/types';
import { AREAS, QUESTIONS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AnswerReviewProps {
  user: User & { open_answers: QuizAnswer[] };
  onClose: () => void;
}

export default function AnswerReview({ user, onClose }: AnswerReviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{user.name} - Acik Uclu Cevaplar</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Kapat</Button>
        </div>
        {user.open_answers.length === 0 ? (
          <p className="text-muted text-sm">Henuz acik uclu cevap yok.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {user.open_answers.map(ans => {
              const area = AREAS.find(a => a.key === ans.area_key);
              const q = QUESTIONS.find(qq => qq.id === ans.question_id);
              return (
                <div key={ans.id} className="border-b border-card-border/50 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{area?.icon}</span>
                    <span className="text-xs text-muted">{area?.name}</span>
                  </div>
                  <p className="text-sm text-muted mb-1">{q?.text}</p>
                  <p className="text-sm">{ans.answer_value}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
