'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MemberList from '@/components/community/MemberList';
import ChatWindow from '@/components/community/ChatWindow';
import EventCard from '@/components/community/EventCard';
import { Group, User, Message, Event } from '@/lib/types';
import { AREAS } from '@/lib/constants';
import { getUserId } from '@/lib/session';

export default function GroupDetailPage() {
  const params = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const groupId = params.groupId;
    if (!groupId) return;

    fetch(`/api/groups/${groupId}`)
      .then(r => r.json())
      .then(data => {
        setGroup(data);
        setMembers(data.members ?? []);
        setMessages(data.messages ?? []);
        setEvents(data.events ?? []);
        const userId = getUserId();
        if (userId && data.members) {
          setJoined(data.members.some((m: User) => m.id === userId));
        }
      });
  }, [params.groupId]);

  const handleJoin = async () => {
    const userId = getUserId();
    if (!userId || !group) return;
    await fetch(`/api/groups/${group.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, content: 'Gruba katıldım! Merhaba!' }),
    });
    setJoined(true);
    // Refresh
    const res = await fetch(`/api/groups/${group.id}`);
    const data = await res.json();
    setMembers(data.members ?? []);
    setMessages(data.messages ?? []);
  };

  if (!group) return <Shell><div className="text-center text-muted py-16">Yukleniyor...</div></Shell>;

  const area = AREAS.find(a => a.key === group.area_key);

  return (
    <Shell>
      <div className="py-8 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{area?.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-sm text-muted">{group.description}</p>
          </div>
          {!joined && getUserId() && (
            <Button size="sm" className="ml-auto" onClick={handleJoin}>Katıl</Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-card-border">
                <h3 className="font-semibold text-sm">Sohbet</h3>
              </div>
              <ChatWindow groupId={group.id} initialMessages={messages} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <MemberList members={members} />
            </Card>

            {events.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Etkinlikler</h3>
                <div className="space-y-2">
                  {events.map(evt => <EventCard key={evt.id} event={evt} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
