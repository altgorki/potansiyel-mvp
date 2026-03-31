'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/kesfet', label: 'Kesfet' },
  { href: '/topluluk', label: 'Topluluk' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="glass sticky top-0 z-50 border-b border-card-border rounded-none">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-teal">P</span>
          <span className="text-lg font-semibold">potansiyel</span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm transition-colors hover:text-teal',
                pathname === item.href ? 'text-teal font-medium' : 'text-muted'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
