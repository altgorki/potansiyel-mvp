'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import { getUserId } from '@/lib/session';
import { timeAgo } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface ChatWindowProps {
  groupId: number;
  initialMessages: Message[];
}

export default function ChatWindow({ groupId, initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = getUserId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/groups/${groupId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    }, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  const handleSend = async () => {
    if (!text.trim() || !userId) return;
    setSending(true);
    await fetch(`/api/groups/${groupId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, content: text.trim() }),
    });
    setText('');
    setSending(false);
    const res = await fetch(`/api/groups/${groupId}`);
    const data = await res.json();
    if (data.messages) setMessages(data.messages);
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map(msg => (
          <div key={msg.id} className="flex gap-3">
            <Avatar name={msg.user_name ?? 'Kullanıcı'} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{msg.user_name}</span>
                <span className="text-xs text-muted">{timeAgo(msg.created_at)}</span>
              </div>
              <p className="text-sm text-muted mt-0.5">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {userId && (
        <div className="border-t border-card-border p-3 flex gap-2">
          <input
            className="flex-1 glass px-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
            placeholder="Mesajını yaz..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <Button size="sm" onClick={handleSend} disabled={sending || !text.trim()}>
            Gonder
          </Button>
        </div>
      )}
    </div>
  );
}
