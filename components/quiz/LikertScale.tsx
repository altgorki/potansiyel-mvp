'use client';

import { cn } from '@/lib/utils';

interface LikertScaleProps {
  value: string;
  onChange: (value: string) => void;
}

const labels = ['Cok Dusuk', 'Dusuk', 'Orta', 'Yuksek', 'Cok Yuksek'];

export default function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div className="flex justify-between gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={cn(
            'flex-1 glass glass-hover py-4 flex flex-col items-center gap-2 transition-all cursor-pointer',
            value === String(n) && 'border-teal/50 glow-teal'
          )}
        >
          <span className={cn('text-xl font-bold', value === String(n) ? 'text-teal' : 'text-muted')}>{n}</span>
          <span className="text-xs text-muted hidden sm:block">{labels[n - 1]}</span>
        </button>
      ))}
    </div>
  );
}
