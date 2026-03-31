'use client';

import Link from 'next/link';
import { User, UserScore } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import TierBadge from './TierBadge';

interface SimilarProfilesProps {
  users: (User & { scores: UserScore[] })[];
}

export default function SimilarProfiles({ users }: SimilarProfilesProps) {
  if (users.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Benzer Profiller</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map(user => (
          <Link key={user.id} href={`/profil/${user.id}`} className="glass glass-hover p-4 flex items-center gap-3">
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-muted">{user.city}</div>
            </div>
            <div className="flex gap-1">
              {user.scores.slice(0, 2).map(s => (
                <TierBadge key={s.area_key} tier={s.tier} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
