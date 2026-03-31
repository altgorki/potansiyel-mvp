import { getDb } from '@/db/database';
import { scoreAnswer } from '@/lib/scoring';
import { getTier } from '@/lib/constants';

export async function POST() {
  const db = getDb();

  // Check if already seeded
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (count.c > 0) {
    return Response.json({ message: 'Zaten seed verisi yuklu', count: count.c });
  }

  const users = [
    { name: 'Elif Yılmaz', age: 24, city: 'İstanbul', bio: 'Full-stack developer, açık kaynak tutkunu' },
    { name: 'Kaan Demir', age: 28, city: 'Ankara', bio: 'Veri bilimci, makine öğrenmesi araştırmacısı' },
    { name: 'Zeynep Acar', age: 22, city: 'İzmir', bio: 'Grafik tasarımcı ve illüstratör' },
    { name: 'Burak Özkan', age: 30, city: 'İstanbul', bio: 'Girişimci, iki startup kurucusu' },
    { name: 'Selin Kaya', age: 26, city: 'Bursa', bio: 'Müzisyen, piyano ve gitar çalıyorum' },
    { name: 'Emre Çelik', age: 25, city: 'Eskişehir', bio: 'Felsefe öğrencisi, eleştirel düşünce meraklısı' },
    { name: 'Ayşe Korkmaz', age: 23, city: 'Antalya', bio: 'Biyoloji araştırma görevlisi' },
    { name: 'Mehmet Arslan', age: 27, city: 'İstanbul', bio: 'UX tasarımcısı, kullanıcı deneyimi uzmanı' },
    { name: 'Deniz Şahin', age: 29, city: 'Ankara', bio: 'Yazılım mühendisi, sistem mimarisi' },
    { name: 'Ceren Yıldız', age: 21, city: 'İzmir', bio: 'Edebiyat öğrencisi, öykü yazarı' },
    { name: 'Oğuz Han', age: 31, city: 'Trabzon', bio: 'Spor eğitmeni, fitness koçu' },
    { name: 'İrem Aktaş', age: 24, city: 'İstanbul', bio: 'İletişim uzmanı, podcast yapımcısı' },
    { name: 'Cem Tuncer', age: 26, city: 'Ankara', bio: 'Yapay zeka araştırmacısı' },
    { name: 'Nazlı Erdem', age: 23, city: 'Konya', bio: 'Geleneksel sanatlar ve hat ustası' },
    { name: 'Barış Güneş', age: 28, city: 'Gaziantep', bio: 'Girişimci, e-ticaret platformu kurucusu' },
    { name: 'Pınar Özdemir', age: 25, city: 'İstanbul', bio: 'Müzik prodüktörü, elektronik müzik' },
    { name: 'Serkan Aydın', age: 27, city: 'Diyarbakır', bio: 'Gazeteci ve belgesel yapımcısı' },
    { name: 'Melis Tan', age: 22, city: 'Mersin', bio: 'Bilgisayar mühendisliği öğrencisi' },
  ];

  const insertUser = db.prepare('INSERT INTO users (name, age, city, bio, is_candidate) VALUES (?, ?, ?, ?, ?)');
  const insertInterest = db.prepare('INSERT INTO user_interests (user_id, area_key) VALUES (?, ?)');
  const insertAnswer = db.prepare('INSERT INTO quiz_answers (user_id, area_key, question_id, answer_type, answer_value, score) VALUES (?, ?, ?, ?, ?, ?)');
  const insertScore = db.prepare('INSERT INTO user_scores (user_id, area_key, score, tier) VALUES (?, ?, ?, ?)');
  const insertGroup = db.prepare('INSERT INTO groups (name, area_key, description, member_count) VALUES (?, ?, ?, ?)');
  const insertGroupMember = db.prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
  const insertMessage = db.prepare('INSERT INTO messages (group_id, user_id, content, created_at) VALUES (?, ?, ?, ?)');
  const insertEvent = db.prepare('INSERT INTO events (group_id, title, description, event_date, location) VALUES (?, ?, ?, ?, ?)');

  // Interest assignments per user
  const userInterests: string[][] = [
    ['teknoloji', 'bilim'],           // Elif
    ['bilim', 'teknoloji'],           // Kaan
    ['sanat', 'tasarim'],             // Zeynep
    ['girisimcilik', 'iletisim'],     // Burak
    ['muzik', 'sanat'],               // Selin
    ['felsefe', 'edebiyat'],          // Emre
    ['bilim', 'felsefe'],             // Ayşe
    ['tasarim', 'teknoloji'],         // Mehmet
    ['teknoloji', 'bilim'],           // Deniz
    ['edebiyat', 'felsefe'],          // Ceren
    ['spor', 'iletisim'],            // Oğuz
    ['iletisim', 'edebiyat'],        // İrem
    ['teknoloji', 'bilim'],           // Cem
    ['sanat', 'felsefe'],             // Nazlı
    ['girisimcilik', 'teknoloji'],    // Barış
    ['muzik', 'tasarim'],             // Pınar
    ['iletisim', 'edebiyat'],        // Serkan
    ['teknoloji', 'tasarim'],         // Melis
  ];

  const candidateIds = [1, 4, 9, 13]; // Elif, Burak, Deniz, Cem

  // MC answer choices per skill level
  const mcChoices = ['a', 'b', 'c'];

  const transaction = db.transaction(() => {
    // Insert users
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      const isCandidate = candidateIds.includes(i + 1) ? 1 : 0;
      insertUser.run(u.name, u.age, u.city, u.bio, isCandidate);
      const userId = i + 1;

      // Insert interests
      for (const interest of userInterests[i]) {
        insertInterest.run(userId, interest);
      }

      // Generate quiz answers and scores for each interest
      for (const areaKey of userInterests[i]) {
        const skillLevel = isCandidate ? 2 : Math.floor(Math.random() * 3); // Candidates get 'c' answers
        let totalRaw = 0;

        // 3 MC questions
        for (let q = 1; q <= 3; q++) {
          const prefix = areaKey.slice(0, 3);
          const qid = `${prefix}-${q}`;
          const choice = mcChoices[skillLevel];
          const score = scoreAnswer(qid, 'multiple_choice', choice);
          insertAnswer.run(userId, areaKey, qid, 'multiple_choice', choice, score);
          totalRaw += score;
        }

        // 2 Likert
        for (let q = 4; q <= 5; q++) {
          const prefix = areaKey.slice(0, 3);
          const qid = `${prefix}-${q}`;
          const likertVal = String(skillLevel + 2 + Math.floor(Math.random() * 2)); // 2-5 range
          const score = scoreAnswer(qid, 'likert', likertVal);
          insertAnswer.run(userId, areaKey, qid, 'likert', likertVal, score);
          totalRaw += score;
        }

        // 1 Open ended
        const prefix = areaKey.slice(0, 3);
        const qid = `${prefix}-6`;
        const openTexts = [
          'Bu alanda kendimi geliştirmek istiyorum, yeni şeyler öğrenmek heyecan verici.',
          'Uzun süredir bu alanla ilgileniyorum ve çeşitli projelerimde deneyim kazandım. Özellikle pratik uygulamalar konusunda kendimi geliştirdim.',
          'Bu alandaki tutkum yıllar içinde büyük projelere dönüştü. Hem teorik hem pratik olarak derinlemesine bilgiye sahibim ve toplulukla paylaşmayı seviyorum.',
        ];
        const openText = openTexts[skillLevel];
        const score = scoreAnswer(qid, 'open_ended', openText);
        insertAnswer.run(userId, areaKey, qid, 'open_ended', openText, score);
        totalRaw += score;

        // Calculate and store area score
        const normalized = Math.round((totalRaw / 120) * 100);
        const clamped = Math.min(100, Math.max(0, normalized));
        const tier = getTier(clamped);
        insertScore.run(userId, areaKey, clamped, tier);
      }
    }

    // Create groups
    const groups = [
      { name: 'Kod Fabrikası', area: 'teknoloji', desc: 'Yazılım geliştirme ve teknoloji tartışmaları' },
      { name: 'Sanat Atölyesi', area: 'sanat', desc: 'Görsel sanatlar ve yaratıcılık paylaşımları' },
      { name: 'Bilim Kafesi', area: 'bilim', desc: 'Bilimsel araştırma ve keşifler' },
      { name: 'Spor Kulübü', area: 'spor', desc: 'Antrenman ipuçları ve spor tartışmaları' },
      { name: 'Kitap Kulübü', area: 'edebiyat', desc: 'Kitap önerileri ve edebi tartışmalar' },
      { name: 'Startup Hub', area: 'girisimcilik', desc: 'Girişimcilik ve iş geliştirme' },
      { name: 'Tasarım Stüdyosu', area: 'tasarim', desc: 'UX/UI ve grafik tasarım paylaşımları' },
      { name: 'Müzik Evi', area: 'muzik', desc: 'Müzik prodüksiyon ve performans' },
      { name: 'Düşünce Kulübü', area: 'felsefe', desc: 'Felsefi tartışmalar ve eleştirel düşünce' },
      { name: 'İletişim Akademisi', area: 'iletisim', desc: 'Etkili iletişim ve medya becerileri' },
    ];

    for (let g = 0; g < groups.length; g++) {
      const group = groups[g];
      // Find members with matching interest
      const memberIds: number[] = [];
      for (let i = 0; i < userInterests.length; i++) {
        if (userInterests[i].includes(group.area)) memberIds.push(i + 1);
      }
      insertGroup.run(group.name, group.area, group.desc, memberIds.length);
      const groupId = g + 1;
      for (const uid of memberIds) {
        insertGroupMember.run(groupId, uid);
      }
    }

    // Seed messages
    const sampleMessages = [
      [1, 1, 'Merhaba! Yeni React Server Components hakkında ne düşünüyorsunuz?', '2024-03-15 10:00:00'],
      [1, 9, 'Harika bir konu! Özellikle streaming SSR ile birlikte çok güçlü.', '2024-03-15 10:15:00'],
      [1, 13, 'Ben de son projemde kullandım, performans farkı inanılmaz.', '2024-03-15 10:30:00'],
      [1, 18, 'Öğrenmek istiyorum, nereden başlamalıyım?', '2024-03-15 11:00:00'],
      [1, 1, 'Next.js dokümantasyonu çok iyi bir başlangıç noktası.', '2024-03-15 11:15:00'],
      [2, 3, 'Bu hafta yeni bir dijital illüstrasyon serisi başladım!', '2024-03-15 09:00:00'],
      [2, 14, 'Harika! Tarzın çok ilham verici.', '2024-03-15 09:30:00'],
      [2, 5, 'Müzik ve görsel sanat birleşimi üzerine çalışıyorum.', '2024-03-15 10:00:00'],
      [3, 2, 'Yeni bir makine öğrenmesi makalesi yayınlandı, okuyan var mı?', '2024-03-16 08:00:00'],
      [3, 7, 'Biyolojide de ML uygulamaları artıyor, çok heyecanlı.', '2024-03-16 08:30:00'],
      [3, 13, 'Transformer mimarisi her alanda devrim yapıyor.', '2024-03-16 09:00:00'],
      [3, 1, 'Veri seti hazırlama sürecinde yardıma ihtiyacım var.', '2024-03-16 09:30:00'],
      [4, 11, 'Bugünkü antrenman programını paylaşıyorum!', '2024-03-16 07:00:00'],
      [5, 10, 'Orhan Pamuk\'un son kitabını okuyan var mı?', '2024-03-15 14:00:00'],
      [5, 6, 'Felsefi derinliği müthiş, karakter gelişimi de çok iyi.', '2024-03-15 14:30:00'],
      [5, 12, 'Ben de okuma listemde, öncelik sırasına aldım.', '2024-03-15 15:00:00'],
      [6, 4, 'MVP geliştirme sürecinde en önemli şey nedir sizce?', '2024-03-16 11:00:00'],
      [6, 15, 'Müşteri validasyonu! Ürünü yapmadan önce talebi doğrula.', '2024-03-16 11:30:00'],
      [6, 4, 'Kesinlikle katılıyorum. İlk startup\'ımda bunu zor yoldan öğrendim.', '2024-03-16 12:00:00'],
      [7, 8, 'Design system oluşturma konusunda workshop yapalım mı?', '2024-03-15 16:00:00'],
      [7, 3, 'Harika fikir! Figma üzerinden canlı yapabiliriz.', '2024-03-15 16:30:00'],
      [7, 16, 'Ben de katılmak isterim, müzik uygulaması UI\'ı üzerinde çalışıyorum.', '2024-03-15 17:00:00'],
      [8, 5, 'Yeni bir şarkı kaydettim, dinlemek ister misiniz?', '2024-03-16 13:00:00'],
      [8, 16, 'Tabii! Hangi DAW kullanıyorsun?', '2024-03-16 13:15:00'],
      [8, 5, 'Logic Pro, ama Ableton\'a geçmeyi düşünüyorum.', '2024-03-16 13:30:00'],
      [9, 6, 'Determinizm ve özgür irade üzerine tartışalım mı?', '2024-03-16 15:00:00'],
      [9, 7, 'Nörobilim perspektifinden çok ilginç argümanlar var.', '2024-03-16 15:30:00'],
      [9, 10, 'Sartre\'ın varoluşçuluk perspektifi hâlâ çok güncel.', '2024-03-16 16:00:00'],
      [9, 14, 'Sanat ve felsefe arasındaki ilişki de tartışılmalı.', '2024-03-16 16:30:00'],
      [10, 12, 'Etkili podcast sunumu için ipuçlarınız var mı?', '2024-03-16 10:00:00'],
      [10, 17, 'Ses tonunu ve hızını değiştirerek dinleyiciyi canlı tutabilirsin.', '2024-03-16 10:30:00'],
      [10, 4, 'Storytelling çok önemli, her bölümde bir hikaye anlat.', '2024-03-16 11:00:00'],
      [10, 11, 'Spor podcast\'i yapmayı düşünüyorum, ilgilenen var mı?', '2024-03-16 11:30:00'],
      [1, 8, 'Tailwind CSS v4 çıktı, design token sistemi harika!', '2024-03-17 09:00:00'],
      [1, 15, 'TypeScript ile tip güvenliği de artmış, sevindim.', '2024-03-17 09:30:00'],
      [3, 2, 'Quantum computing üzerine bir review yazdım, linki paylaşıyorum.', '2024-03-17 10:00:00'],
      [6, 15, 'YC başvuru süreci hakkında deneyimlerimi paylaşabilirim.', '2024-03-17 14:00:00'],
      [6, 4, 'Çok değerli olur! Online bir oturum ayarlayalım.', '2024-03-17 14:30:00'],
    ];

    for (const msg of sampleMessages) {
      insertMessage.run(msg[0], msg[1], msg[2], msg[3]);
    }

    // Seed events
    const sampleEvents = [
      [1, 'Hackathon: 48 Saat Kod', 'İki günlük yoğun kodlama maratonu', '2024-04-15', 'İstanbul Teknopark'],
      [1, 'TypeScript Workshop', 'İleri düzey TypeScript teknikleri', '2024-04-20', 'Online - Zoom'],
      [2, 'Dijital Sanat Sergisi', 'Üyelerin eserlerinin dijital sergisi', '2024-04-10', 'Sanat Galerisi, Beyoğlu'],
      [3, 'Bilim Semineri', 'Yapay zeka ve etik üzerine panel', '2024-04-25', 'Ankara Üniversitesi'],
      [3, 'Veri Bilimi Workshop', 'Python ile veri analizi eğitimi', '2024-05-01', 'Online - Meet'],
      [4, 'Koşu Etkinliği', 'Haftalık grup koşusu - 10K', '2024-04-07', 'Maçka Parkı, İstanbul'],
      [5, 'Kitap Tartışması', 'Bu ayın kitabı: Tutunamayanlar', '2024-04-12', 'Online - Discord'],
      [6, 'Startup Pitch Night', 'Fikirlerinizi sunun, geri bildirim alın', '2024-04-18', 'Kolektif House, Levent'],
      [6, 'Mentörlük Buluşması', 'Deneyimli girişimcilerle networking', '2024-05-05', 'Online - Zoom'],
      [7, 'Figma Masterclass', 'Design system oluşturma workshop\'u', '2024-04-22', 'Online - Figma'],
      [8, 'Akustik Gece', 'Canlı performans ve jam session', '2024-04-14', 'Kadıköy Sahne'],
      [8, 'Prodüksiyon 101', 'Başlangıç seviye müzik prodüksiyonu', '2024-04-28', 'Online - Ableton'],
      [9, 'Felsefe Kahvaltısı', 'Aylık felsefe tartışma buluşması', '2024-04-08', 'Bebek Kahvesi, İstanbul'],
      [10, 'Sunum Teknikleri', 'Etkili sunum yapma eğitimi', '2024-04-16', 'Online - Zoom'],
      [10, 'Podcast Workshop', 'Sıfırdan podcast oluşturma', '2024-05-03', 'Radyo Evi, Ankara'],
      [2, 'Portre Çizim Atölyesi', 'Canlı model ile portre çalışması', '2024-04-30', 'Sanat Merkezi, İzmir'],
      [4, 'Yoga ve Meditasyon', 'Haftalık yoga seansı', '2024-04-09', 'Park Bahçe, Antalya'],
      [7, 'UI Critique Session', 'Projelerinizi paylaşın, geri bildirim alın', '2024-05-08', 'Online - Discord'],
      [5, 'Yazarlık Atölyesi', 'Öykü yazma teknikleri workshop', '2024-05-10', 'Kadıköy Kültür Merkezi'],
      [9, 'Film ve Felsefe', 'Matrix filmi üzerinden felsefe tartışması', '2024-04-26', 'Sinema Salonu, Eskişehir'],
    ];

    for (const evt of sampleEvents) {
      insertEvent.run(evt[0], evt[1], evt[2], evt[3], evt[4]);
    }
  });

  transaction();

  return Response.json({ message: 'Seed verisi yuklendi', userCount: users.length });
}
