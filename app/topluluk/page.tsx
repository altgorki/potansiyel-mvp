'use client';

import { useEffect, useState } from 'react';
import Shell from '@/components/layout/Shell';
import GroupCard from '@/components/community/GroupCard';
import { Group } from '@/lib/types';

export default function ToplulukPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/groups').then(r => r.json()).then(setGroups);
  }, []);

  return (
    <Shell>
      <div className="py-8 fade-in">
        <h1 className="text-2xl font-bold mb-6">Topluluklar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
        {groups.length === 0 && (
          <div className="text-center text-muted py-16">
            Henuz topluluk yok. Seed verisini yuklemeyi deneyin.
          </div>
        )}
      </div>
    </Shell>
  );
}
