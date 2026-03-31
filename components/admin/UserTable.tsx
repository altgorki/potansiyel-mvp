'use client';

import { User, UserScore, QuizAnswer } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import TierBadge from '@/components/profile/TierBadge';
import Badge from '@/components/ui/Badge';
import { AREAS } from '@/lib/constants';

interface AdminUser extends User {
  scores: UserScore[];
  open_answers: QuizAnswer[];
}

interface UserTableProps {
  users: AdminUser[];
  onToggleCandidate: (userId: number, current: number) => void;
  onViewAnswers: (user: AdminUser) => void;
}

export default function UserTable({ users, onToggleCandidate, onViewAnswers }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border text-left text-muted">
            <th className="pb-3 font-medium">Kullanıcı</th>
            <th className="pb-3 font-medium">Sehir</th>
            <th className="pb-3 font-medium">Puanlar</th>
            <th className="pb-3 font-medium">Aday</th>
            <th className="pb-3 font-medium">Islem</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-card-border/50 hover:bg-white/[0.02]">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={user.name} size="sm" />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted">#{user.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-muted">{user.city ?? '-'}</td>
              <td className="py-3">
                <div className="flex gap-1 flex-wrap">
                  {user.scores.map(s => {
                    const area = AREAS.find(a => a.key === s.area_key);
                    return (
                      <span key={s.area_key} className="text-xs">
                        {area?.icon} <TierBadge tier={s.tier} />
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="py-3">
                <button
                  onClick={() => onToggleCandidate(user.id, user.is_candidate)}
                  className="cursor-pointer"
                >
                  {user.is_candidate ? (
                    <Badge color="#f59e0b">Aday</Badge>
                  ) : (
                    <Badge color="#94a3b8">-</Badge>
                  )}
                </button>
              </td>
              <td className="py-3">
                <button
                  onClick={() => onViewAnswers(user)}
                  className="text-teal hover:underline text-xs cursor-pointer"
                >
                  Cevapları Gor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
