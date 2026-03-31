'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/layout/Shell';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import TierBadge from '@/components/profile/TierBadge';
import Input from '@/components/ui/Input';
import { User, UserScore } from '@/lib/types';
import { AREAS } from '@/lib/constants';

export default function KesfetPage() {
  const [users, setUsers] = useState<(User & { scores: UserScore[] })[]>([]);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/users?${params}`)
      .then(r => r.json())
      .then(setUsers);
  }, [search]);

  const filtered = areaFilter
    ? users.filter(u => u.scores?.some(s => s.area_key === areaFilter))
    : users;

  return (
    <Shell>
      <div className="py-8 fade-in">
        <h1 className="text-2xl font-bold mb-6">Profilleri Kesfet</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Isim ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <select
            className="glass px-4 py-2.5 text-sm text-foreground bg-transparent focus:outline-none"
            value={areaFilter}
            onChange={e => setAreaFilter(e.target.value)}
          >
            <option value="" className="bg-card">Tum Alanlar</option>
            {AREAS.map(a => <option key={a.key} value={a.key} className="bg-card">{a.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(user => (
            <Link key={user.id} href={`/profil/${user.id}`}>
              <Card hover>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={user.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted">{user.city}{user.age ? `, ${user.age}` : ''}</div>
                  </div>
                </div>
                {user.bio && <p className="text-xs text-muted mb-3 line-clamp-2">{user.bio}</p>}
                <div className="flex gap-1 flex-wrap">
                  {user.scores?.map(s => {
                    const area = AREAS.find(a => a.key === s.area_key);
                    return (
                      <span key={s.area_key} className="inline-flex items-center gap-1 text-xs">
                        {area?.icon} <TierBadge tier={s.tier} />
                      </span>
                    );
                  })}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted py-16">
            Henuz profil bulunamadı. Seed verisini yuklemeyi deneyin.
          </div>
        )}
      </div>
    </Shell>
  );
}
