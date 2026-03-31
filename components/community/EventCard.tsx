import { Event } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function EventCard({ event }: { event: Event }) {
  return (
    <Card className="p-4">
      <h4 className="font-medium text-sm">{event.title}</h4>
      <p className="text-xs text-muted mt-1">{event.description}</p>
      <div className="flex gap-4 mt-3 text-xs text-muted">
        <span>{formatDate(event.event_date)}</span>
        {event.location && <span>{event.location}</span>}
      </div>
    </Card>
  );
}
