'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import RadarChart from '@/components/profile/RadarChart';
import TierBadge from '@/components/profile/TierBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import SimilarProfiles from '@/components/profile/SimilarProfiles';
import { User, UserScore } from '@/lib/types';
import { AREAS, getTierColor } from '@/lib/constants';

export default function ProfilPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [similar, setSimilar] = useState<(User & { scores: UserScore[] })[]>([]);

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setScores(data.scores ?? []);
      });

    // Fetch all users for similar profiles
    fetch('/api/users')
      .then(r => r.json())
      .then((allUsers: (User & { scores: UserScore[] })[]) => {
        const others = allUsers.filter(u => u.id !== Number(id) && u.scores?.length > 0);
        setSimilar(others.slice(0, 4));
      });
  }, [params.id]);

  if (!user) return <Shell><div className="text-center text-muted py-16">Yukleniyor...</div></Shell>;

  return (
    <Shell>
      <div className="max-w-3xl mx-auto py-8 fade-in">
        {/* Profile header */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <Avatar name={user.name} size="lg" />
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <div className="text-sm text-muted mt-1">
                {user.age && `${user.age} yas`}
                {user.city && ` • ${user.city}`}
              </div>
              {user.bio && <p className="text-sm text-muted mt-2">{user.bio}</p>}
            </div>
          </div>
        </Card>

        {/* Radar chart */}
        {scores.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Yetenek Profili</h2>
            <RadarChart scores={scores} />
          </Card>
        )}

        {/* Score details */}
        {scores.length > 0 && (
          <div className="grid gap-3 mb-6">
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
        )}

        {/* Similar profiles */}
        <SimilarProfiles users={similar} />
      </div>
    </Shell>
  );
}
