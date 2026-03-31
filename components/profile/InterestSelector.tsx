'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AREAS } from '@/lib/constants';
import { getUserId } from '@/lib/session';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function InterestSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (key: string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : prev.length < 5 ? [...prev, key] : prev);
  };

  const handleSubmit = async () => {
    const userId = getUserId();
    if (!userId || selected.length === 0) return;
    setLoading(true);

    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests: selected }),
    });
    router.push('/degerlendirme');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Ilgi Alanlarını Sec</h2>
      <p className="text-muted text-sm mb-6">En az 1, en fazla 5 alan sec. Bu alanlarda degerlendirme yapılacak.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {AREAS.map(area => (
          <Card
            key={area.key}
            hover
            className={cn(
              'text-center transition-all',
              selected.includes(area.key) && 'border-teal/50 glow-teal'
            )}
            onClick={() => toggle(area.key)}
          >
            <div className="text-2xl mb-2">{area.icon}</div>
            <div className="font-medium text-sm">{area.name}</div>
            <div className="text-xs text-muted mt-1">{area.description}</div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted">{selected.length}/5 alan secildi</span>
        <Button onClick={handleSubmit} disabled={loading || selected.length === 0}>
          {loading ? 'Kaydediliyor...' : 'Degerlendirmeye Basla'}
        </Button>
      </div>
    </div>
  );
}
