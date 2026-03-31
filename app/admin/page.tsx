'use client';

import { useEffect, useState, useCallback } from 'react';
import Shell from '@/components/layout/Shell';
import Card from '@/components/ui/Card';
import FilterBar from '@/components/admin/FilterBar';
import UserTable from '@/components/admin/UserTable';
import AnswerReview from '@/components/admin/AnswerReview';
import { User, UserScore, QuizAnswer } from '@/lib/types';

type AdminUser = User & { scores: UserScore[]; open_answers: QuizAnswer[] };

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('');
  const [candidateOnly, setCandidateOnly] = useState(false);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (area) params.set('area', area);
    if (candidateOnly) params.set('candidate', '1');
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data);
  }, [search, area, candidateOnly]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleCandidate = async (userId: number, current: number) => {
    await fetch('/api/admin/mark', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, is_candidate: current ? 0 : 1 }),
    });
    fetchUsers();
  };

  return (
    <Shell>
      <div className="py-8 fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Paneli</h1>
          <span className="text-xs text-muted glass px-3 py-1">{users.length} kullanıcı</span>
        </div>

        <FilterBar
          area={area}
          onAreaChange={setArea}
          candidateOnly={candidateOnly}
          onCandidateChange={setCandidateOnly}
          search={search}
          onSearchChange={setSearch}
        />

        <Card>
          <UserTable
            users={users}
            onToggleCandidate={handleToggleCandidate}
            onViewAnswers={setViewingUser}
          />
        </Card>

        {viewingUser && (
          <AnswerReview user={viewingUser} onClose={() => setViewingUser(null)} />
        )}
      </div>
    </Shell>
  );
}
