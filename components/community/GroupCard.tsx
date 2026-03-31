import Link from 'next/link';
import { Group } from '@/lib/types';
import { AREAS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function GroupCard({ group }: { group: Group }) {
  const area = AREAS.find(a => a.key === group.area_key);
  return (
    <Link href={`/topluluk/${group.id}`}>
      <Card hover>
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{area?.icon}</span>
          <Badge color="#0d9488">{group.member_count} uye</Badge>
        </div>
        <h3 className="font-semibold mb-1">{group.name}</h3>
        <p className="text-sm text-muted line-clamp-2">{group.description}</p>
      </Card>
    </Link>
  );
}
