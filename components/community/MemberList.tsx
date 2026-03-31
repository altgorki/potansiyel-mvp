import { User } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';

export default function MemberList({ members }: { members: User[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-muted mb-1">Uyeler ({members.length})</h4>
      {members.map(m => (
        <div key={m.id} className="flex items-center gap-2 py-1">
          <Avatar name={m.name} size="sm" />
          <span className="text-sm">{m.name}</span>
        </div>
      ))}
    </div>
  );
}
