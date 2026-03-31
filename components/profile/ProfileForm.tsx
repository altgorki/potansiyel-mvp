'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { setUserId } from '@/lib/session';
import { CITIES } from '@/lib/constants';

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', city: '', bio: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, age: form.age ? parseInt(form.age) : null, city: form.city || null, bio: form.bio || null }),
    });
    const data = await res.json();
    setUserId(data.id);
    router.push('/ilgi-alanlari');
  };

  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Profilini Olustur</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="name" label="Adın" placeholder="Adını gir..." value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        <Input id="age" label="Yas" type="number" placeholder="Yasını gir..." value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} min={13} max={99} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm text-muted">Sehir</label>
          <select
            id="city"
            className="glass px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-teal/50 transition-colors bg-transparent"
            value={form.city}
            onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
          >
            <option value="" className="bg-card">Sehir sec...</option>
            {CITIES.map(c => <option key={c} value={c} className="bg-card">{c}</option>)}
          </select>
        </div>
        <Textarea id="bio" label="Hakkında" placeholder="Kendini kısaca anlat..." rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
        <Button type="submit" disabled={loading || !form.name.trim()} className="mt-2">
          {loading ? 'Olusturuluyor...' : 'Devam Et'}
        </Button>
      </form>
    </Card>
  );
}
