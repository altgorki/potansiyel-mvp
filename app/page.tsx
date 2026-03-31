'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/layout/Shell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getUserId } from '@/lib/session';
import { AREAS } from '@/lib/constants';

export default function HomePage() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  return (
    <Shell>
      <div className="fade-in">
        {/* Hero */}
        <section className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-teal">Potansiyel</span>ini Kesfet
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Yeteneklerini olc, benzer profilleri bul, topluluklara katıl.
            Potansiyelini ortaya koy.
          </p>
          <div className="flex gap-4 justify-center">
            {userId ? (
              <>
                <Link href={`/profil/${userId}`}>
                  <Button>Profilim</Button>
                </Link>
                <Link href="/kesfet">
                  <Button variant="secondary">Kesfet</Button>
                </Link>
              </>
            ) : (
              <Link href="/olustur">
                <Button size="lg">Basla</Button>
              </Link>
            )}
          </div>
        </section>

        {/* Areas preview */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-center mb-8">10 Yetenek Alanı</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AREAS.map(area => (
              <Card key={area.key} className="text-center p-4">
                <div className="text-3xl mb-2">{area.icon}</div>
                <div className="text-sm font-medium">{area.name}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Nasıl Calısır?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Profil Olustur', desc: 'Adını, sehrini ve ilgi alanlarını belirle.' },
              { step: '2', title: 'Degerlendirme', desc: 'Her alan icin 6 sorudan olusan quiz\'i tamamla.' },
              { step: '3', title: 'Kesfet & Katıl', desc: 'Sonuclarını gor, benzer profilleri bul, topluluklara katıl.' },
            ].map(item => (
              <Card key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-teal/20 text-teal flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="py-8 text-center">
          <p className="text-xs text-muted/50">100 demo profil otomatik yuklenir</p>
        </section>
      </div>
    </Shell>
  );
}
