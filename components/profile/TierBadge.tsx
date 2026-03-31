import Badge from '@/components/ui/Badge';
import { getTierColor } from '@/lib/constants';

export default function TierBadge({ tier }: { tier: string }) {
  return <Badge color={getTierColor(tier)}>{tier}</Badge>;
}
