'use client';

import { Textarea } from '@/components/ui/Input';

interface OpenEndedProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OpenEnded({ value, onChange }: OpenEndedProps) {
  return (
    <div>
      <Textarea
        placeholder="Cevabını yaz..."
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <p className="text-xs text-muted mt-2">
        {value.length} karakter {value.length < 20 && '(daha detaylı yaz, daha yuksek puan al!)'}
      </p>
    </div>
  );
}
