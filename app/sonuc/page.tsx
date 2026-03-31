'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/layout/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RadarChart from '@/components/profile/RadarChart';
import TierBadge from '@/components/profile/TierBadge';
import { getUserId } from '@/lib/session';
import { UserScore, User } from '@/lib/types';
import { AREAS } from '@/lib/constants';
import ProgressBar from '@/components/ui/ProgressBar';
import { getTierColor } from '@/lib/constants';

export default function SonucPage() {
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<UserScore[]>([]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setScores(data.scores ?? []);
      });
  }, []);

  if (!user) return <Shell><div className="text-center text-muted py-16">Yukleniyor...</div></Shell>;

  return (
    <Shell>
      <div className="max-w-2xl mx-auto py-8 fade-in">
        <h1 className="text-2xl font-bold text-center mb-2">Sonucların Hazır!</h1>
        <p className="text-muted text-center mb-8">İste yetenek profilin, {user.name}.</p>

        <Card className="mb-6">
          <RadarChart scores={scores} />
        </Card>

        <div className="grid gap-3 mb-8">
          {scores.map(s => {
            const area = AREAS.find(a => a.key === s.area_key);
            return (
              <Card key={s.area_key} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{area?.icon}</span>
                    <span className="font-medium text-sm">{area?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: getTierColor(s.tier) }}>{Math.round(s.score)}</span>
                    <TierBadge tier={s.tier} />
                  </div>
                </div>
                <ProgressBar value={s.score} color={getTierColor(s.tier)} />
              </Card>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          <Link href={`/profil/${user.id}`}>
            <Button>Profilimi Gor</Button>
          </Link>
          <Link href="/kesfet">
            <Button variant="secondary">Profilleri Kesfet</Button>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
