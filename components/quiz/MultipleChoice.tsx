'use client';

import { cn } from '@/lib/utils';
import { Question } from '@/lib/types';

interface MultipleChoiceProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function MultipleChoice({ question, value, onChange }: MultipleChoiceProps) {
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'glass glass-hover p-4 text-left text-sm transition-all cursor-pointer',
            value === opt.value && 'border-teal/50 glow-teal text-teal'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
