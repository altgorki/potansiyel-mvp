import Database from 'better-sqlite3';
import { scoreAnswer } from '@/lib/scoring';
import { getTier } from '@/lib/constants';

const AREA_KEYS = ['teknoloji','sanat','bilim','spor','edebiyat','girisimcilik','tasarim','muzik','felsefe','iletisim'];

const USERS = [
  { name: 'Elif Yılmaz', age: 24, city: 'İstanbul', bio: 'Full-stack developer, açık kaynak tutkunu', interests: ['teknoloji','bilim'], candidate: true },
  { name: 'Kaan Demir', age: 28, city: 'Ankara', bio: 'Veri bilimci, makine öğrenmesi araştırmacısı', interests: ['bilim','teknoloji'], candidate: false },
  { name: 'Zeynep Acar', age: 22, city: 'İzmir', bio: 'Grafik tasarımcı ve illüstratör', interests: ['sanat','tasarim'], candidate: false },
  { name: 'Burak Özkan', age: 30, city: 'İstanbul', bio: 'Girişimci, iki startup kurucusu', interests: ['girisimcilik','iletisim'], candidate: true },
  { name: 'Selin Kaya', age: 26, city: 'Bursa', bio: 'Müzisyen, piyano ve gitar çalıyorum', interests: ['muzik','sanat'], candidate: false },
  { name: 'Emre Çelik', age: 25, city: 'Eskişehir', bio: 'Felsefe öğrencisi, eleştirel düşünce meraklısı', interests: ['felsefe','edebiyat'], candidate: false },
  { name: 'Ayşe Korkmaz', age: 23, city: 'Antalya', bio: 'Biyoloji araştırma görevlisi', interests: ['bilim','felsefe'], candidate: false },
  { name: 'Mehmet Arslan', age: 27, city: 'İstanbul', bio: 'UX tasarımcısı, kullanıcı deneyimi uzmanı', interests: ['tasarim','teknoloji'], candidate: false },
  { name: 'Deniz Şahin', age: 29, city: 'Ankara', bio: 'Yazılım mühendisi, sistem mimarisi', interests: ['teknoloji','bilim'], candidate: true },
  { name: 'Ceren Yıldız', age: 21, city: 'İzmir', bio: 'Edebiyat öğrencisi, öykü yazarı', interests: ['edebiyat','felsefe'], candidate: false },
  { name: 'Oğuz Han', age: 31, city: 'Trabzon', bio: 'Spor eğitmeni, fitness koçu', interests: ['spor','iletisim'], candidate: false },
  { name: 'İrem Aktaş', age: 24, city: 'İstanbul', bio: 'İletişim uzmanı, podcast yapımcısı', interests: ['iletisim','edebiyat'], candidate: false },
  { name: 'Cem Tuncer', age: 26, city: 'Ankara', bio: 'Yapay zeka araştırmacısı', interests: ['teknoloji','bilim'], candidate: true },
  { name: 'Nazlı Erdem', age: 23, city: 'Konya', bio: 'Geleneksel sanatlar ve hat ustası', interests: ['sanat','felsefe'], candidate: false },
  { name: 'Barış Güneş', age: 28, city: 'Gaziantep', bio: 'Girişimci, e-ticaret platformu kurucusu', interests: ['girisimcilik','teknoloji'], candidate: true },
  { name: 'Pınar Özdemir', age: 25, city: 'İstanbul', bio: 'Müzik prodüktörü, elektronik müzik', interests: ['muzik','tasarim'], candidate: false },
  { name: 'Serkan Aydın', age: 27, city: 'Diyarbakır', bio: 'Gazeteci ve belgesel yapımcısı', interests: ['iletisim','edebiyat'], candidate: false },
  { name: 'Melis Tan', age: 22, city: 'Mersin', bio: 'Bilgisayar mühendisliği öğrencisi', interests: ['teknoloji','tasarim'], candidate: false },
  // 19-100: Ek kullanıcılar
  { name: 'Ahmet Yıldırım', age: 32, city: 'İstanbul', bio: 'Backend developer, Go ve Rust tutkunu', interests: ['teknoloji','bilim'], candidate: true },
  { name: 'Fatma Demir', age: 24, city: 'Ankara', bio: 'Moleküler biyolog, genetik araştırmacı', interests: ['bilim','felsefe'], candidate: false },
  { name: 'Murat Koç', age: 29, city: 'İzmir', bio: 'Endüstriyel tasarımcı, 3D modelleme uzmanı', interests: ['tasarim','sanat'], candidate: false },
  { name: 'Hülya Çetin', age: 26, city: 'Bursa', bio: 'Yoga eğitmeni, wellness koçu', interests: ['spor','felsefe'], candidate: false },
  { name: 'Tolga Kılıç', age: 30, city: 'İstanbul', bio: 'Fintech girişimcisi, angel investor', interests: ['girisimcilik','teknoloji'], candidate: true },
  { name: 'Aslı Yılmaz', age: 23, city: 'Eskişehir', bio: 'Seramik sanatçısı, atölye eğitmeni', interests: ['sanat','edebiyat'], candidate: false },
  { name: 'Kerem Aydın', age: 27, city: 'Antalya', bio: 'Profesyonel yüzücü, antrenör', interests: ['spor','iletisim'], candidate: false },
  { name: 'Dilan Arslan', age: 22, city: 'Diyarbakır', bio: 'Kürt edebiyatı araştırmacısı, şair', interests: ['edebiyat','iletisim'], candidate: false },
  { name: 'Onur Yılmaz', age: 28, city: 'İstanbul', bio: 'DevOps mühendisi, cloud mimarı', interests: ['teknoloji','girisimcilik'], candidate: false },
  { name: 'Gizem Çelik', age: 25, city: 'Ankara', bio: 'Klasik gitar sanatçısı, konservatuar mezunu', interests: ['muzik','sanat'], candidate: false },
  { name: 'Arda Kaya', age: 31, city: 'İzmir', bio: 'Spor gazetecisi, futbol analisti', interests: ['spor','iletisim'], candidate: false },
  { name: 'Esra Özdemir', age: 24, city: 'Konya', bio: 'Grafik roman çizeri, illüstratör', interests: ['sanat','edebiyat'], candidate: false },
  { name: 'Ufuk Şahin', age: 33, city: 'İstanbul', bio: 'Blockchain geliştirici, Web3 araştırmacısı', interests: ['teknoloji','girisimcilik'], candidate: true },
  { name: 'Yasemin Güneş', age: 26, city: 'Trabzon', bio: 'Deniz biyoloğu, çevre aktivisti', interests: ['bilim','iletisim'], candidate: false },
  { name: 'Can Erdem', age: 29, city: 'Gaziantep', bio: 'Mutfak sanatları şefi, gastronomi yazarı', interests: ['sanat','girisimcilik'], candidate: false },
  { name: 'Defne Aktaş', age: 21, city: 'İstanbul', bio: 'Tiyatro öğrencisi, sahne sanatları', interests: ['iletisim','sanat'], candidate: false },
  { name: 'Baran Tuncer', age: 27, city: 'Ankara', bio: 'Astrofizik doktora öğrencisi', interests: ['bilim','felsefe'], candidate: false },
  { name: 'Sude Korkmaz', age: 23, city: 'İzmir', bio: 'Motion graphics tasarımcısı', interests: ['tasarim','teknoloji'], candidate: false },
  { name: 'Alp Yılmaz', age: 30, city: 'Bursa', bio: 'Otomotiv mühendisi, maker', interests: ['teknoloji','spor'], candidate: false },
  { name: 'Nisa Demir', age: 25, city: 'Antalya', bio: 'Çocuk gelişimi uzmanı, yazar', interests: ['edebiyat','felsefe'], candidate: false },
  { name: 'Kağan Çelik', age: 28, city: 'İstanbul', bio: 'Product manager, SaaS deneyimi', interests: ['girisimcilik','tasarim'], candidate: false },
  { name: 'Elif Arslan', age: 22, city: 'Eskişehir', bio: 'Fotoğrafçı, belgesel projeleri', interests: ['sanat','iletisim'], candidate: false },
  { name: 'Doruk Han', age: 34, city: 'İstanbul', bio: 'Seri girişimci, 3 exit yapmış founder', interests: ['girisimcilik','iletisim'], candidate: true },
  { name: 'Nehir Kaya', age: 24, city: 'Ankara', bio: 'Jazz vokalisti, müzik eğitmeni', interests: ['muzik','iletisim'], candidate: false },
  { name: 'Emir Şahin', age: 26, city: 'İzmir', bio: 'Siber güvenlik uzmanı, CTF yarışmacısı', interests: ['teknoloji','bilim'], candidate: false },
  { name: 'Lale Özkan', age: 23, city: 'Konya', bio: 'Minyatür sanatçısı, müze eğitmeni', interests: ['sanat','felsefe'], candidate: false },
  { name: 'Bora Güneş', age: 29, city: 'Mersin', bio: 'Yelken sporcusu, denizcilik eğitmeni', interests: ['spor','girisimcilik'], candidate: false },
  { name: 'Tuğçe Erdem', age: 25, city: 'İstanbul', bio: 'Data engineer, büyük veri sistemleri', interests: ['teknoloji','bilim'], candidate: false },
  { name: 'Koray Aydın', age: 31, city: 'Diyarbakır', bio: 'Arkeolog, kültürel miras uzmanı', interests: ['bilim','edebiyat'], candidate: false },
  { name: 'İpek Yılmaz', age: 22, city: 'İstanbul', bio: 'Moda tasarımcısı, sürdürülebilir moda', interests: ['tasarim','sanat'], candidate: false },
  { name: 'Umut Çetin', age: 27, city: 'Ankara', bio: 'Robotik mühendisi, Arduino uzmanı', interests: ['teknoloji','bilim'], candidate: false },
  { name: 'Ada Kılıç', age: 24, city: 'İzmir', bio: 'Çağdaş dans performansçısı', interests: ['sanat','spor'], candidate: false },
  { name: 'Selim Arslan', age: 33, city: 'İstanbul', bio: 'Hukuk danışmanı, startup avukatı', interests: ['girisimcilik','felsefe'], candidate: false },
  { name: 'Yağmur Demir', age: 21, city: 'Bursa', bio: 'Sosyal medya içerik üreticisi', interests: ['iletisim','tasarim'], candidate: false },
  { name: 'Tuna Korkmaz', age: 28, city: 'Trabzon', bio: 'Dağcı, outdoor rehberi', interests: ['spor','felsefe'], candidate: false },
  { name: 'Cansu Özdemir', age: 25, city: 'Antalya', bio: 'Botanik araştırmacısı, bitki koleksiyoncusu', interests: ['bilim','sanat'], candidate: false },
  { name: 'Batuhan Şahin', age: 30, city: 'İstanbul', bio: 'Game developer, Unity uzmanı', interests: ['teknoloji','tasarim'], candidate: false },
  { name: 'Melisa Güneş', age: 23, city: 'Ankara', bio: 'Psikoloji öğrencisi, danışman adayı', interests: ['felsefe','iletisim'], candidate: false },
  { name: 'Ege Yılmaz', age: 26, city: 'İzmir', bio: 'DJ ve elektronik müzik prodüktörü', interests: ['muzik','teknoloji'], candidate: false },
  { name: 'Zehra Aktaş', age: 24, city: 'Konya', bio: 'Ebru sanatçısı, geleneksel el sanatları', interests: ['sanat','felsefe'], candidate: false },
  { name: 'Utku Çelik', age: 29, city: 'İstanbul', bio: 'Growth hacker, dijital pazarlama', interests: ['girisimcilik','iletisim'], candidate: false },
  { name: 'Simge Kaya', age: 22, city: 'Eskişehir', bio: 'Animasyon sanatçısı, kısa film yapımcısı', interests: ['sanat','tasarim'], candidate: false },
  { name: 'Cenk Demir', age: 35, city: 'İstanbul', bio: 'CTO, 15 yıllık yazılım deneyimi', interests: ['teknoloji','girisimcilik'], candidate: true },
  { name: 'Bensu Arslan', age: 25, city: 'Ankara', bio: 'Çevirmen, 4 dil biliyor', interests: ['edebiyat','iletisim'], candidate: false },
  { name: 'Çınar Han', age: 27, city: 'Antalya', bio: 'Surf eğitmeni, su sporları tutkunu', interests: ['spor','girisimcilik'], candidate: false },
  { name: 'Hazal Tuncer', age: 23, city: 'İzmir', bio: 'Seramik ve heykel öğrencisi', interests: ['sanat','felsefe'], candidate: false },
  { name: 'Taylan Güneş', age: 31, city: 'İstanbul', bio: 'Mobil uygulama geliştirici, Flutter uzmanı', interests: ['teknoloji','tasarim'], candidate: false },
  { name: 'Nilüfer Erdem', age: 24, city: 'Bursa', bio: 'Opera sanatçısı adayı, soprano', interests: ['muzik','edebiyat'], candidate: false },
  { name: 'Atlas Yılmaz', age: 28, city: 'Diyarbakır', bio: 'Belgesel fotoğrafçı, savaş muhabiri', interests: ['iletisim','sanat'], candidate: false },
  { name: 'Naz Çetin', age: 22, city: 'Mersin', bio: 'Biyomedikal mühendisliği öğrencisi', interests: ['bilim','teknoloji'], candidate: false },
  { name: 'Rüzgar Kılıç', age: 26, city: 'Trabzon', bio: 'E-spor oyuncusu, takım kaptanı', interests: ['teknoloji','spor'], candidate: false },
  { name: 'Derya Özkan', age: 30, city: 'İstanbul', bio: 'Marka stratejisti, kreatif direktör', interests: ['tasarim','girisimcilik'], candidate: false },
  { name: 'Irmak Aydın', age: 23, city: 'Ankara', bio: 'Matematik olimpiyat madalyalısı', interests: ['bilim','felsefe'], candidate: false },
  { name: 'Toprak Şahin', age: 27, city: 'İzmir', bio: 'Organik çiftçi, permakültür eğitmeni', interests: ['bilim','girisimcilik'], candidate: false },
  { name: 'Asya Korkmaz', age: 25, city: 'İstanbul', bio: 'Film yönetmeni adayı, senaryo yazarı', interests: ['edebiyat','sanat'], candidate: false },
  { name: 'Yiğit Demir', age: 32, city: 'Ankara', bio: 'Savunma sanayii mühendisi', interests: ['teknoloji','bilim'], candidate: false },
  { name: 'Nil Güneş', age: 21, city: 'Eskişehir', bio: 'Grafik tasarım öğrencisi, tipografi meraklısı', interests: ['tasarim','sanat'], candidate: false },
  { name: 'Kuzey Arslan', age: 29, city: 'Antalya', bio: 'Triathlon sporcusu, beslenme danışmanı', interests: ['spor','bilim'], candidate: false },
  { name: 'Maya Çelik', age: 24, city: 'İstanbul', bio: 'Podcast yapımcısı, ses tasarımcısı', interests: ['iletisim','muzik'], candidate: false },
  { name: 'Deniz Aktaş', age: 26, city: 'Konya', bio: 'Felsefe doktora öğrencisi, etik araştırmacı', interests: ['felsefe','edebiyat'], candidate: false },
  { name: 'Poyraz Yılmaz', age: 28, city: 'İstanbul', bio: 'Frontend developer, React uzmanı', interests: ['teknoloji','tasarim'], candidate: false },
  { name: 'Duru Kaya', age: 23, city: 'İzmir', bio: 'Keman sanatçısı, oda müziği', interests: ['muzik','felsefe'], candidate: false },
  { name: 'Eymen Tuncer', age: 30, city: 'Gaziantep', bio: 'Gıda mühendisi, restoran işletmecisi', interests: ['girisimcilik','bilim'], candidate: false },
  { name: 'Almila Şahin', age: 22, city: 'Bursa', bio: 'Tekstil tasarımcısı, el dokuma', interests: ['sanat','tasarim'], candidate: false },
  { name: 'Çağan Demir', age: 27, city: 'İstanbul', bio: 'AI/ML mühendisi, NLP uzmanı', interests: ['teknoloji','bilim'], candidate: true },
  { name: 'Lina Erdem', age: 25, city: 'Ankara', bio: 'Kültür yöneticisi, sanat küratörü', interests: ['sanat','iletisim'], candidate: false },
  { name: 'Rüya Güneş', age: 24, city: 'İstanbul', bio: 'Stand-up komedyen, oyun yazarı', interests: ['iletisim','edebiyat'], candidate: false },
  { name: 'Tan Kılıç', age: 29, city: 'Trabzon', bio: 'Balıkçılık kooperatifi başkanı', interests: ['girisimcilik','spor'], candidate: false },
  { name: 'Damla Özdemir', age: 23, city: 'Antalya', bio: 'Oşinografi öğrencisi, dalış eğitmeni', interests: ['bilim','spor'], candidate: false },
  { name: 'Erdem Yılmaz', age: 34, city: 'İstanbul', bio: 'VP of Engineering, startup mentörü', interests: ['teknoloji','girisimcilik'], candidate: true },
  { name: 'Şimal Arslan', age: 22, city: 'Diyarbakır', bio: 'Halk müziği sanatçısı, bağlama', interests: ['muzik','edebiyat'], candidate: false },
  { name: 'Berk Çetin', age: 26, city: 'İzmir', bio: 'CrossFit antrenörü, spor beslenmeci', interests: ['spor','bilim'], candidate: false },
  { name: 'Cemre Aydın', age: 25, city: 'Ankara', bio: 'UX researcher, kullanıcı testleri uzmanı', interests: ['tasarim','felsefe'], candidate: false },
  { name: 'Ata Han', age: 28, city: 'İstanbul', bio: 'Kripto para analizcisi, DeFi uzmanı', interests: ['girisimcilik','teknoloji'], candidate: false },
  { name: 'Mira Kaya', age: 21, city: 'Eskişehir', bio: 'Cam sanatçısı, atölye eğitmeni', interests: ['sanat','girisimcilik'], candidate: false },
  { name: 'Polat Demir', age: 33, city: 'İstanbul', bio: 'Investigative journalist, savaş muhabiri', interests: ['iletisim','felsefe'], candidate: false },
  { name: 'Su Korkmaz', age: 24, city: 'İzmir', bio: 'Pilates eğitmeni, fizyoterapist', interests: ['spor','bilim'], candidate: false },
  { name: 'Güneş Şahin', age: 27, city: 'Konya', bio: 'Hat ve tezhip sanatçısı', interests: ['sanat','felsefe'], candidate: false },
  { name: 'Alara Tuncer', age: 23, city: 'Bursa', bio: 'Sosyoloji öğrencisi, alan araştırmacısı', interests: ['felsefe','iletisim'], candidate: false },
  { name: 'Yaman Güneş', age: 30, city: 'Antalya', bio: 'Solar enerji girişimcisi', interests: ['girisimcilik','bilim'], candidate: false },
  { name: 'Lara Özkan', age: 22, city: 'İstanbul', bio: 'Hip-hop dansçısı, koreograf', interests: ['sanat','spor'], candidate: false },
  { name: 'Volkan Tekin', age: 26, city: 'Trabzon', bio: 'Drone fotoğrafçısı, havacılık tutkunu', interests: ['teknoloji','sanat'], candidate: false },
];

// Seeded random based on index for deterministic results
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const GROUPS = [
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

// Group ID (1-indexed) -> array of [userId, message, datetime]
const CHAT_MESSAGES: [number, string, string][][] = [
  // Grup 1: Kod Fabrikası (teknoloji)
  [
    [1, 'Merhaba! Yeni React Server Components hakkında ne düşünüyorsunuz?', '2024-03-10 10:00:00'],
    [9, 'Harika bir konu! Özellikle streaming SSR ile birlikte çok güçlü.', '2024-03-10 10:15:00'],
    [13, 'Ben de son projemde kullandım, performans farkı inanılmaz.', '2024-03-10 10:30:00'],
    [18, 'Öğrenmek istiyorum, nereden başlamalıyım?', '2024-03-10 11:00:00'],
    [1, 'Next.js dokümantasyonu çok iyi bir başlangıç noktası.', '2024-03-10 11:15:00'],
    [8, 'Tailwind CSS v4 çıktı, design token sistemi harika!', '2024-03-11 09:00:00'],
    [15, 'TypeScript ile tip güvenliği de artmış, sevindim.', '2024-03-11 09:30:00'],
    [19, 'Go ile mikroservis mimarisi kuran var mı? Deneyimlerini merak ediyorum.', '2024-03-12 08:00:00'],
    [27, 'Kubernetes üzerinde çalışıyoruz, istersen detaylı anlatayım.', '2024-03-12 08:30:00'],
    [9, 'Biz de Docker Compose ile başladık ama K8s\'e geçmeyi düşünüyoruz.', '2024-03-12 09:00:00'],
    [31, 'Web3 tarafında Solidity ile akıllı kontrat yazanlar? Gas optimizasyonu ipuçları lazım.', '2024-03-13 10:00:00'],
    [13, 'Ethers.js v6 çok daha temiz bir API sunuyor, öneririm.', '2024-03-13 10:30:00'],
    [43, 'Siber güvenlik konusunda CTF çözen var mı? Takım kurmak istiyorum.', '2024-03-14 11:00:00'],
    [19, 'HackTheBox\'ta aktifim, katılırım!', '2024-03-14 11:30:00'],
    [55, 'Yeni bir game engine deniyorum, Godot 4.0 harika olmuş.', '2024-03-15 09:00:00'],
    [18, 'Unity mi Godot mu tartışması bitmez ama Godot\'un açık kaynak olması büyük avantaj.', '2024-03-15 09:30:00'],
    [36, 'Flutter ile cross-platform geliştirme yapan var mı? Native performans miti mi?', '2024-03-15 14:00:00'],
    [65, 'Son projemde Flutter kullandım, performanstan memnunum.', '2024-03-15 14:30:00'],
    [1, 'Rust öğrenmeye başladım, ownership konsepti başta zor ama sonra çok mantıklı.', '2024-03-16 10:00:00'],
    [49, 'Rust ile embedded systems projesi yapıyorum, güvenlik açısından mükemmel.', '2024-03-16 10:30:00'],
    [61, 'CTO olarak en büyük challenge: teknik borç yönetimi. Deneyimlerinizi paylaşır mısınız?', '2024-03-17 08:00:00'],
    [9, 'Sprint\'lerin %20\'sini refactoring\'e ayırıyoruz, iyi çalışıyor.', '2024-03-17 08:30:00'],
    [27, 'CI/CD pipeline otomasyonu bunu çok kolaylaştırıyor.', '2024-03-17 09:00:00'],
    [83, 'NLP alanında Transformer modelleri üzerine çalışıyorum. Fine-tuning deneyimi olan?', '2024-03-18 11:00:00'],
    [13, 'Hugging Face ile çok güzel sonuçlar aldım, özellikle Türkçe modellerde.', '2024-03-18 11:30:00'],
    [37, 'Arduino ile IoT projeleri yapan var mı? Sensör verisi toplama konusunda tavsiye lazım.', '2024-03-18 14:00:00'],
    [49, 'MQTT protokolü ile veri iletimi çok verimli, ESP32 ile kullanıyorum.', '2024-03-18 14:30:00'],
    [79, 'React Native mi Flutter mi mobilde? Yeni projeye başlıyorum.', '2024-03-19 09:00:00'],
    [65, 'Flutter\'ın widget sistemi çok tutarlı, tavsiye ederim.', '2024-03-19 09:30:00'],
    [1, 'Bu hafta sonu hackathon düzenliyoruz, katılmak isteyen var mı?', '2024-03-20 10:00:00'],
  ],
  // Grup 2: Sanat Atölyesi (sanat)
  [
    [3, 'Bu hafta yeni bir dijital illüstrasyon serisi başladım!', '2024-03-10 09:00:00'],
    [14, 'Harika! Tarzın çok ilham verici.', '2024-03-10 09:30:00'],
    [5, 'Müzik ve görsel sanat birleşimi üzerine çalışıyorum.', '2024-03-10 10:00:00'],
    [24, 'Seramik atölyemde yeni bir seri pişirdim, paylaşacağım yakında.', '2024-03-11 11:00:00'],
    [30, 'Grafik roman projem için karakter tasarımları yapıyorum, fikir alışverişi yapmak isterim.', '2024-03-11 14:00:00'],
    [3, 'Procreate mı Photoshop mu dijital çizim için?', '2024-03-12 09:00:00'],
    [48, 'İkisini de kullanıyorum ama tablet üzerinde Procreate çok rahat.', '2024-03-12 09:30:00'],
    [14, 'Geleneksel sanatları dijitale taşıma üzerine bir proje başlattım.', '2024-03-13 10:00:00'],
    [44, 'Minyatür sanatını AR ile birleştirmeyi hayal ediyorum.', '2024-03-13 10:30:00'],
    [58, 'Ebru sanatı workshopu düzenleyelim mi? Hem geleneksel hem modern teknikler.', '2024-03-14 11:00:00'],
    [40, 'Harika fikir! Fotoğrafçı olarak belgelemeyi de yapabilirim.', '2024-03-14 11:30:00'],
    [30, 'Grafik roman sahnelerini paylaştım, geri bildirim rica ederim.', '2024-03-15 10:00:00'],
    [51, 'Çok etkileyici! Panel geçişleri çok akıcı.', '2024-03-15 10:30:00'],
    [64, 'Cam sanatı ile ilgilenen var mı? Atölyemde yer var.', '2024-03-16 09:00:00'],
    [24, 'Seramik ve cam birleşimi denedim, çok güzel sonuçlar çıkıyor.', '2024-03-16 09:30:00'],
    [84, 'Lina burada mı? Küratörlük projesi hakkında konuşmak istiyorum.', '2024-03-16 14:00:00'],
    [34, 'Tiyatro sahne tasarımı için işbirliği yapmak isteyen sanatçılar var mı?', '2024-03-17 10:00:00'],
    [3, 'İlgilenirim! Dijital projeksiyon ile sahne tasarımı yapabiliriz.', '2024-03-17 10:30:00'],
    [96, 'Hat sanatı üzerine modern yorumlar yapıyorum, paylaşmak isterim.', '2024-03-18 09:00:00'],
    [14, 'Geleneksel ve modernin buluşması çok güçlü, görmek isteriz.', '2024-03-18 09:30:00'],
    [100, 'Hip-hop kültüründe görsel sanatın yeri hakkında bir sunum hazırlıyorum.', '2024-03-19 11:00:00'],
    [40, 'Sokak sanatı belgeselim için röportaj yapabilir miyim seninle?', '2024-03-19 11:30:00'],
  ],
  // Grup 3: Bilim Kafesi (bilim)
  [
    [2, 'Yeni bir makine öğrenmesi makalesi yayınlandı, okuyan var mı?', '2024-03-10 08:00:00'],
    [7, 'Biyolojide de ML uygulamaları artıyor, çok heyecanlı.', '2024-03-10 08:30:00'],
    [13, 'Transformer mimarisi her alanda devrim yapıyor.', '2024-03-10 09:00:00'],
    [1, 'Veri seti hazırlama sürecinde yardıma ihtiyacım var.', '2024-03-10 09:30:00'],
    [2, 'Quantum computing üzerine bir review yazdım, paylaşıyorum.', '2024-03-11 10:00:00'],
    [20, 'CRISPR-Cas9 ile gen düzenleme alanında inanılmaz gelişmeler var.', '2024-03-12 09:00:00'],
    [7, 'Biyoinformatik açısından çok heyecan verici bir dönem.', '2024-03-12 09:30:00'],
    [35, 'Astrofizik doktora tezimi kozmik arka plan radyasyonu üzerine yazıyorum.', '2024-03-13 10:00:00'],
    [32, 'Deniz biyolojisi alanında iklim değişikliğinin mercan resiflerine etkisini araştırıyorum.', '2024-03-13 14:00:00'],
    [46, 'Veri bilimi projelerimde Python mu R mı kullanmalıyım tartışması.', '2024-03-14 08:00:00'],
    [2, 'İkisi de güçlü, ama ekosistem olarak Python daha geniş.', '2024-03-14 08:30:00'],
    [71, 'Matematik olimpiyatlarından bilimsel araştırmaya geçiş deneyimimi paylaşabilirim.', '2024-03-15 10:00:00'],
    [49, 'Robotik ve yapay zeka kesişiminde çalışan var mı?', '2024-03-15 10:30:00'],
    [83, 'NLP ve bilgi çıkarımı üzerine çalışıyorum, disiplinler arası iş birliği çok değerli.', '2024-03-16 09:00:00'],
    [68, 'Biyomedikal mühendislikte sensör teknolojileri ile ilgileniyorum.', '2024-03-16 09:30:00'],
    [76, 'Triathlon için performans verilerimi analiz ediyorum, spor bilimi muhteşem.', '2024-03-17 08:00:00'],
    [47, 'Arkeolojide karbon-14 tarihleme üzerine yeni bulgularımız var.', '2024-03-17 14:00:00'],
    [72, 'Permakültür ve toprak bilimi üzerine çalışıyorum, ilgilenen?', '2024-03-18 10:00:00'],
    [54, 'Botanik araştırmalarımda toprak mikrobiyomu ile ilgileniyorum.', '2024-03-18 10:30:00'],
    [20, 'Bu hafta journal club yapıyoruz, katılmak isteyen makaleyi paylaşayım.', '2024-03-19 09:00:00'],
    [35, 'Harika! Astrofizik makaleleri de ekleyelim listeye.', '2024-03-19 09:30:00'],
    [89, 'Oşinografi ve denizaltı araştırmaları hakkında sunum yapabilirim.', '2024-03-20 11:00:00'],
  ],
  // Grup 4: Spor Kulübü (spor)
  [
    [11, 'Bugünkü antrenman programını paylaşıyorum!', '2024-03-10 07:00:00'],
    [25, 'Bu hafta 10K koşu hedefim var, birlikte koşacak var mı?', '2024-03-10 07:30:00'],
    [22, 'Yoga ve meditasyon sabah rutinime eklendi, fark inanılmaz.', '2024-03-11 06:00:00'],
    [29, 'Futbol analizi yapmak isteyenler için Wyscout erişimim var.', '2024-03-11 10:00:00'],
    [11, 'Haftalık CrossFit WOD\'unu paylaşıyorum, denemek isteyen?', '2024-03-12 07:00:00'],
    [45, 'Yelken sezonu açıldı! Bu hafta sonu tekne çıkaracağım.', '2024-03-12 09:00:00'],
    [25, 'Yüzme tekniğimi geliştirmek istiyorum, tavsiye var mı?', '2024-03-13 08:00:00'],
    [53, 'Dağcılık sezonu yaklaşıyor, Kaçkar Dağları planı olan?', '2024-03-13 10:00:00'],
    [76, 'Triathlon antrenman planımı paylaşıyorum, feedback isterim.', '2024-03-14 07:00:00'],
    [91, 'CrossFit ile fonksiyonel fitness arasındaki farkları tartışalım.', '2024-03-14 14:00:00'],
    [11, 'Beslenme planı önerileri: protein alımı konusunda ne yapıyorsunuz?', '2024-03-15 08:00:00'],
    [22, 'Bitkisel protein kaynakları hakkında blog yazım var, paylaşayım.', '2024-03-15 08:30:00'],
    [63, 'Surf sezonunu açtık! Alanya\'da dalgalar muhteşem.', '2024-03-16 09:00:00'],
    [37, 'Maker projesi olarak akıllı fitness tracker yapıyorum, ilgilenen?', '2024-03-16 14:00:00'],
    [50, 'Çağdaş dans ve fitness birleşimi workshop düzenleyelim mi?', '2024-03-17 10:00:00'],
    [29, 'Premier Lig analiz videomu paylaştım, yorumlarınızı bekliyorum.', '2024-03-17 14:00:00'],
    [25, 'Yeni yüzme rekorumu kırdım! 1500m serbest stilde 18:45.', '2024-03-18 08:00:00'],
    [76, 'Tebrikler! Ben de bisiklet bacağımı geliştirmeye çalışıyorum.', '2024-03-18 08:30:00'],
    [53, 'Hafta sonu Uludağ\'da trekking planı var, gelmek isteyen?', '2024-03-19 10:00:00'],
    [94, 'Pilates ve fizyoterapi birleşimi yeni programım hazır, deneyenler?', '2024-03-19 14:00:00'],
    [89, 'Dalış eğitimi almak isteyen var mı? Open water sertifikası kursu düzenliyorum.', '2024-03-20 09:00:00'],
  ],
  // Grup 5: Kitap Kulübü (edebiyat)
  [
    [10, 'Orhan Pamuk\'un son kitabını okuyan var mı?', '2024-03-10 14:00:00'],
    [6, 'Felsefi derinliği müthiş, karakter gelişimi de çok iyi.', '2024-03-10 14:30:00'],
    [12, 'Ben de okuma listemde, öncelik sırasına aldım.', '2024-03-10 15:00:00'],
    [26, 'Kürt edebiyatından önerilerim var, ilgilenen?', '2024-03-11 10:00:00'],
    [10, 'Çok isteriz! Çeviri eserleri mi yoksa orijinal mi?', '2024-03-11 10:30:00'],
    [62, 'Dört dilde okuyorum, çeviri kalitesi hakkında panel yapalım mı?', '2024-03-12 14:00:00'],
    [38, 'Çocuk edebiyatı yazıyorum, geri bildirim verecek okur arıyorum.', '2024-03-12 15:00:00'],
    [17, 'Bu ayın kitabı ne olsun? Öneriler?', '2024-03-13 09:00:00'],
    [6, 'Dostoyevski\'nin Yeraltından Notlar\'ını öneriyorum.', '2024-03-13 09:30:00'],
    [73, 'Film ve edebiyat adaptasyonları hakkında tartışalım.', '2024-03-14 14:00:00'],
    [10, 'Bir kitabı filme çekerken kaybedilen şeyler çok fazla.', '2024-03-14 14:30:00'],
    [30, 'Grafik roman da edebiyat mıdır tartışması açmak istiyorum.', '2024-03-15 10:00:00'],
    [26, 'Kesinlikle! Maus ve Persepolis başyapıtlar.', '2024-03-15 10:30:00'],
    [85, 'Rüya Güneş burada mı? Stand-up metinlerini edebiyat perspektifinden inceleyebilir miyiz?', '2024-03-16 11:00:00'],
    [62, 'Yaratıcı yazarlık atölyesi düzenleyelim, online olabilir.', '2024-03-16 14:00:00'],
    [38, 'Çocuk kitabı illüstrasyonları için sanat atölyesiyle iş birliği yapalım.', '2024-03-17 09:00:00'],
    [17, 'Belgesel ve edebiyat arasındaki ilişki üzerine yazım var.', '2024-03-17 14:00:00'],
    [67, 'Opera librettoları da edebiyat sayılır mı? Tartışalım!', '2024-03-18 10:00:00'],
    [10, 'Tabii ki! Wagner\'in Ring Cycle\'ı başlı başına bir edebi eser.', '2024-03-18 10:30:00'],
    [12, 'Podcast\'imde bu konuyu işleyebiliriz, misafir olur musunuz?', '2024-03-19 09:00:00'],
    [26, 'Çok isterim! Kürt edebiyatını da dahil edersek harika olur.', '2024-03-19 09:30:00'],
  ],
  // Grup 6: Startup Hub (girisimcilik)
  [
    [4, 'MVP geliştirme sürecinde en önemli şey nedir sizce?', '2024-03-10 11:00:00'],
    [15, 'Müşteri validasyonu! Ürünü yapmadan önce talebi doğrula.', '2024-03-10 11:30:00'],
    [4, 'Kesinlikle katılıyorum. İlk startup\'ımda bunu zor yoldan öğrendim.', '2024-03-10 12:00:00'],
    [15, 'YC başvuru süreci hakkında deneyimlerimi paylaşabilirim.', '2024-03-11 14:00:00'],
    [4, 'Çok değerli olur! Online bir oturum ayarlayalım.', '2024-03-11 14:30:00'],
    [23, 'Fintech alanında regülasyon engelleri çok fazla, deneyimler?', '2024-03-12 10:00:00'],
    [41, 'Seri girişimci olarak söyleyebilirim: regülasyonu rakip değil, moat olarak görün.', '2024-03-12 10:30:00'],
    [31, 'Web3 girişimleri için funding ortamı nasıl? Deneyimleriniz?', '2024-03-13 09:00:00'],
    [15, 'E-ticaret tarafında bootstrapping ile büyüdük, VC almadık.', '2024-03-13 09:30:00'],
    [39, 'Product-market fit nasıl ölçüyorsunuz? Metrikleriniz neler?', '2024-03-14 11:00:00'],
    [23, 'NPS ve retention rate en önemli ikisi bence.', '2024-03-14 11:30:00'],
    [41, 'Cohort analizi yapın, ilk 30 günlük retention kritik.', '2024-03-14 12:00:00'],
    [61, 'Startup\'ta teknik kurucu olmanın avantajları ve dezavantajları hakkında yazdım.', '2024-03-15 10:00:00'],
    [70, 'Marka stratejisi startup\'ın en başından itibaren önemli, ihmal etmeyin.', '2024-03-15 14:00:00'],
    [87, 'Erdem, mentörlük programınıza başvurabilir miyim?', '2024-03-16 09:00:00'],
    [61, 'Tabii ki, DM at detayları konuşalım.', '2024-03-16 09:30:00'],
    [33, 'Gastronomi girişimi kurmak istiyorum, deneyimli birini arıyorum.', '2024-03-17 10:00:00'],
    [4, 'F&B sektöründe unit economics çok önemli, konuşalım.', '2024-03-17 10:30:00'],
    [72, 'Tarım teknolojisi (AgTech) alanında girişim fırsatları hakkında düşünenler?', '2024-03-18 11:00:00'],
    [97, 'Solar enerji girişimimle ilgili deneyimlerimi paylaşabilirim.', '2024-03-18 11:30:00'],
    [92, 'Kripto ve DeFi alanında yeni proje planlıyorum, teknik kurucu arıyorum.', '2024-03-19 09:00:00'],
    [31, 'İlgilenirim, smart contract tarafında deneyimim var.', '2024-03-19 09:30:00'],
    [41, 'Pitch deck hazırlama ipuçları paylaşıyorum, yararlı olabilir.', '2024-03-20 10:00:00'],
  ],
  // Grup 7: Tasarım Stüdyosu (tasarim)
  [
    [8, 'Design system oluşturma konusunda workshop yapalım mı?', '2024-03-10 16:00:00'],
    [3, 'Harika fikir! Figma üzerinden canlı yapabiliriz.', '2024-03-10 16:30:00'],
    [16, 'Ben de katılmak isterim, müzik uygulaması UI\'ı üzerinde çalışıyorum.', '2024-03-10 17:00:00'],
    [21, 'Endüstriyel tasarım perspektifinden de katkı sağlayabilirim.', '2024-03-11 10:00:00'],
    [36, 'Motion design bilen var mı? Proje için yardıma ihtiyacım var.', '2024-03-12 09:00:00'],
    [48, 'İPek, sürdürülebilir moda tasarımı hakkında sunum yapar mısın?', '2024-03-12 14:00:00'],
    [55, 'Game UI tasarımı ile web UI arasındaki farkları tartışalım.', '2024-03-13 10:00:00'],
    [8, 'Kullanıcı araştırması metodları üzerine bir kaynak listesi hazırladım.', '2024-03-13 14:00:00'],
    [70, 'Marka kimliği tasarımı projesi için portfolio örnekleri paylaşayım.', '2024-03-14 09:00:00'],
    [75, 'Nil burada mı? Tipografi workshop\'u yapalım mı?', '2024-03-14 14:00:00'],
    [36, 'Accessibility (erişilebilirlik) konusunda ne kadar dikkatlisiniz?', '2024-03-15 10:00:00'],
    [8, 'WCAG 2.1 AA standartlarını minimum olarak uyguluyoruz.', '2024-03-15 10:30:00'],
    [82, 'Figma\'nın yeni AI özellikleri hakkında ne düşünüyorsunuz?', '2024-03-16 09:00:00'],
    [21, 'Prototipleme için çok faydalı ama final tasarımda hâlâ insan eli lazım.', '2024-03-16 09:30:00'],
    [39, 'Product design ve UX research iş birliği nasıl olmalı? Deneyimler?', '2024-03-17 10:00:00'],
    [90, 'Kullanıcı testleri sonuçlarını tasarım kararlarına nasıl yansıtıyorsunuz?', '2024-03-17 10:30:00'],
    [16, 'Müzik uygulaması UI\'ımı paylaştım, geri bildirim rica ederim!', '2024-03-18 14:00:00'],
    [8, 'Çok temiz! Ama dark mode\'da kontrast oranlarını kontrol et.', '2024-03-18 14:30:00'],
    [48, 'Moda ve dijital tasarım kesişiminde yeni trendler hakkında yazım var.', '2024-03-19 09:00:00'],
    [55, 'Game jam düzenleyelim mi? Tasarımcı + developer takımları kuralım.', '2024-03-19 14:00:00'],
  ],
  // Grup 8: Müzik Evi (muzik)
  [
    [5, 'Yeni bir şarkı kaydettim, dinlemek ister misiniz?', '2024-03-10 13:00:00'],
    [16, 'Tabii! Hangi DAW kullanıyorsun?', '2024-03-10 13:15:00'],
    [5, 'Logic Pro, ama Ableton\'a geçmeyi düşünüyorum.', '2024-03-10 13:30:00'],
    [28, 'Klasik gitar için yeni bir etüd serisi hazırladım.', '2024-03-11 10:00:00'],
    [57, 'Elektronik müzik prodüksiyonunda synthesizer seçimi çok önemli.', '2024-03-11 14:00:00'],
    [16, 'Serum mu Vital mı? Ben Vital\'i tercih ediyorum, ücretsiz ve güçlü.', '2024-03-11 14:30:00'],
    [42, 'Jazz vokal tekniklerini paylaşabilirim, ilgilenen var mı?', '2024-03-12 10:00:00'],
    [67, 'Opera ve popüler müzik arasındaki köprüler hakkında düşünenler?', '2024-03-12 14:00:00'],
    [5, 'Crossover projeleri çok ilham verici, Andrea Bocelli mesela.', '2024-03-12 14:30:00'],
    [88, 'Bağlama ile folk-rock füzyonu deniyorum, feedback isterim.', '2024-03-13 09:00:00'],
    [28, 'Çok ilginç! Geleneksel enstrümanlarla modern türleri birleştirmek güzel.', '2024-03-13 09:30:00'],
    [57, 'DJ set\'imi paylaştım, yeni parçalar var.', '2024-03-14 13:00:00'],
    [16, 'Kick drum\'ın çok güçlü, mix dengesi mükemmel.', '2024-03-14 13:30:00'],
    [81, 'Keman ile ambient müzik projesi yapan var mı?', '2024-03-15 10:00:00'],
    [42, 'Jazz ve ambient birleşimi çok güzel olabilir, deneyelim.', '2024-03-15 10:30:00'],
    [77, 'Podcast için jingle ve müzik yapımı konusunda yardım lazım.', '2024-03-16 09:00:00'],
    [16, 'Yapabilirim! Hangi tarzda düşünüyorsun?', '2024-03-16 09:30:00'],
    [5, 'Akustik gece etkinliği düzenleyelim, canlı performans ve jam session.', '2024-03-17 10:00:00'],
    [28, 'Harika! Klasik gitar ile katılırım.', '2024-03-17 10:30:00'],
    [88, 'Ben de bağlamayla geleceğim, folk jam olsun!', '2024-03-17 11:00:00'],
    [57, 'Müzik prodüksiyonu başlangıç kursu düzenleyeyim mi? Talep var mı?', '2024-03-18 14:00:00'],
    [67, 'Ses eğitimi ve vokal teknikler workshop\'u da ekleyelim.', '2024-03-18 14:30:00'],
  ],
  // Grup 9: Düşünce Kulübü (felsefe)
  [
    [6, 'Determinizm ve özgür irade üzerine tartışalım mı?', '2024-03-10 15:00:00'],
    [7, 'Nörobilim perspektifinden çok ilginç argümanlar var.', '2024-03-10 15:30:00'],
    [10, 'Sartre\'ın varoluşçuluk perspektifi hâlâ çok güncel.', '2024-03-10 16:00:00'],
    [14, 'Sanat ve felsefe arasındaki ilişki de tartışılmalı.', '2024-03-10 16:30:00'],
    [22, 'Doğu felsefesi ve batı felsefesi karşılaştırması yapalım.', '2024-03-11 14:00:00'],
    [35, 'Bilim felsefesi açısından Kuhn vs Popper tartışması hâlâ güncel.', '2024-03-12 10:00:00'],
    [56, 'Psikoloji ve felsefe arasındaki sınır nerede?', '2024-03-12 14:00:00'],
    [6, 'Consciousness problemi tam da bu sınırda duruyor.', '2024-03-12 14:30:00'],
    [78, 'Felsefe tarihi bilgini nasıl değerlendirirsiniz? Hangi dönemi seviyorsunuz?', '2024-03-13 10:00:00'],
    [52, 'Etik ve teknoloji: yapay zeka etiği üzerine bir seminer düzenleyelim.', '2024-03-13 14:00:00'],
    [7, 'Biyoetik açısından da çok önemli bir konu, katılırım.', '2024-03-13 14:30:00'],
    [71, 'Matematik felsefesi: sayılar gerçek mi yoksa zihinsel yapılar mı?', '2024-03-14 10:00:00'],
    [6, 'Platonist vs nominalist tartışması, klasik ama hâlâ çözülmemiş.', '2024-03-14 10:30:00'],
    [90, 'Tasarım etiği ve kullanıcı manipülasyonu hakkında ne düşünüyorsunuz?', '2024-03-15 09:00:00'],
    [14, 'Dark patterns konusu sanat ve felsefe perspektifinden de incelenebilir.', '2024-03-15 09:30:00'],
    [95, 'Sosyoloji ve felsefe kesişimi: toplumsal yapıların felsefi analizi.', '2024-03-16 10:00:00'],
    [22, 'Yoga felsefesi ve mindfulness üzerine okuma grubu kuralım mı?', '2024-03-17 14:00:00'],
    [56, 'Harika fikir! Stoik felsefe ile de birleştirebiliriz.', '2024-03-17 14:30:00'],
    [53, 'Doğa felsefesi ve çevrecilik: Aldo Leopold\'un düşünceleri.', '2024-03-18 10:00:00'],
    [78, 'Felsefe kahvaltısı etkinliğimiz bu Pazar, herkes davetli!', '2024-03-19 09:00:00'],
    [6, 'Konu ne olacak bu sefer?', '2024-03-19 09:30:00'],
    [78, 'Adalet teorileri: Rawls vs Nozick.', '2024-03-19 10:00:00'],
  ],
  // Grup 10: İletişim Akademisi (iletisim)
  [
    [12, 'Etkili podcast sunumu için ipuçlarınız var mı?', '2024-03-10 10:00:00'],
    [17, 'Ses tonunu ve hızını değiştirerek dinleyiciyi canlı tutabilirsin.', '2024-03-10 10:30:00'],
    [4, 'Storytelling çok önemli, her bölümde bir hikaye anlat.', '2024-03-10 11:00:00'],
    [11, 'Spor podcast\'i yapmayı düşünüyorum, ilgilenen var mı?', '2024-03-10 11:30:00'],
    [34, 'Tiyatro deneyiminden gelen sahne korkusu yönetimi ipuçlarım var.', '2024-03-11 09:00:00'],
    [26, 'Çok dilli iletişim ve kültürlerarası dinamikler üzerine konuşabilirim.', '2024-03-12 10:00:00'],
    [41, 'Girişimciler için pitch yapma teknikleri workshop\'u düzenleyelim.', '2024-03-12 14:00:00'],
    [12, 'Harika! Podcast\'imde canlı olarak yapalım.', '2024-03-12 14:30:00'],
    [59, 'Sosyal medya içerik stratejisi hakkında deneyimlerimi paylaşabilirim.', '2024-03-13 09:00:00'],
    [77, 'Podcast ve ses tasarımı iş birliği yapmak isterim.', '2024-03-13 14:00:00'],
    [29, 'Spor iletişimi ve medya ilişkileri üzerine yazım var.', '2024-03-14 10:00:00'],
    [17, 'Gazetecilik etiği ve doğru haber verme üzerine tartışalım.', '2024-03-14 14:00:00'],
    [32, 'Bilim iletişimi çok önemli, halka anlatma konusunda eksiklerimiz var.', '2024-03-15 09:00:00'],
    [4, 'İş dünyasında etkili sunum yapma: 10 altın kural.', '2024-03-15 14:00:00'],
    [84, 'Sanat küratörü olarak sergi iletişimi ve basın bülteni yazma deneyimim var.', '2024-03-16 10:00:00'],
    [85, 'Stand-up komedide seyirci etkileşimi teknikleri paylaşabilirim.', '2024-03-16 14:00:00'],
    [12, 'Bu hafta podcast bölümümde iletişim trendlerini konuşacağım, öneriler?', '2024-03-17 09:00:00'],
    [59, 'TikTok ve kısa video formatlarının iletişimi nasıl dönüştürdüğü.', '2024-03-17 09:30:00'],
    [93, 'İnvestigative journalism ve kaynak koruma hakkında bir sunum hazırlıyorum.', '2024-03-18 10:00:00'],
    [42, 'Müzik endüstrisinde PR ve iletişim konusunda deneyimimi paylaşabilirim.', '2024-03-18 14:00:00'],
    [34, 'Sahne sanatlarında beden dili ve sözsüz iletişim workshop\'u yapalım.', '2024-03-19 10:00:00'],
    [17, 'Habercilik ve etik: sosyal medya çağında doğrulama yöntemleri.', '2024-03-20 09:00:00'],
  ],
];

const EVENTS = [
  [1, 'Hackathon: 48 Saat Kod', 'İki günlük yoğun kodlama maratonu', '2024-04-15', 'İstanbul Teknopark'],
  [1, 'TypeScript Workshop', 'İleri düzey TypeScript teknikleri', '2024-04-20', 'Online - Zoom'],
  [1, 'Rust Başlangıç Kursu', 'Sıfırdan Rust öğrenme atölyesi', '2024-05-05', 'Online - Discord'],
  [2, 'Dijital Sanat Sergisi', 'Üyelerin eserlerinin dijital sergisi', '2024-04-10', 'Sanat Galerisi, Beyoğlu'],
  [2, 'Portre Çizim Atölyesi', 'Canlı model ile portre çalışması', '2024-04-30', 'Sanat Merkezi, İzmir'],
  [2, 'Ebru Workshop', 'Geleneksel ebru sanatı atölyesi', '2024-05-12', 'Kültür Merkezi, Konya'],
  [3, 'Bilim Semineri', 'Yapay zeka ve etik üzerine panel', '2024-04-25', 'Ankara Üniversitesi'],
  [3, 'Veri Bilimi Workshop', 'Python ile veri analizi eğitimi', '2024-05-01', 'Online - Meet'],
  [3, 'Journal Club', 'Aylık bilimsel makale tartışması', '2024-04-08', 'Online - Zoom'],
  [4, 'Koşu Etkinliği', 'Haftalık grup koşusu - 10K', '2024-04-07', 'Maçka Parkı, İstanbul'],
  [4, 'Yoga ve Meditasyon', 'Haftalık yoga seansı', '2024-04-09', 'Park Bahçe, Antalya'],
  [4, 'Trekking: Uludağ', 'Günübirlik dağ yürüyüşü', '2024-04-21', 'Uludağ, Bursa'],
  [5, 'Kitap Tartışması', 'Bu ayın kitabı: Tutunamayanlar', '2024-04-12', 'Online - Discord'],
  [5, 'Yazarlık Atölyesi', 'Öykü yazma teknikleri workshop', '2024-05-10', 'Kadıköy Kültür Merkezi'],
  [5, 'Çeviri Paneli', 'Edebi çeviri süreçleri ve zorlukları', '2024-04-28', 'Online - Zoom'],
  [6, 'Startup Pitch Night', 'Fikirlerinizi sunun, geri bildirim alın', '2024-04-18', 'Kolektif House, Levent'],
  [6, 'Mentörlük Buluşması', 'Deneyimli girişimcilerle networking', '2024-05-05', 'Online - Zoom'],
  [6, 'Product-Market Fit Workshop', 'PMF ölçme ve strateji', '2024-04-26', 'WeWork, Maslak'],
  [7, 'Figma Masterclass', 'Design system oluşturma workshop\'u', '2024-04-22', 'Online - Figma'],
  [7, 'UI Critique Session', 'Projelerinizi paylaşın, geri bildirim alın', '2024-05-08', 'Online - Discord'],
  [7, 'Accessibility Workshop', 'WCAG standartları ve erişilebilir tasarım', '2024-04-15', 'Online - Zoom'],
  [8, 'Akustik Gece', 'Canlı performans ve jam session', '2024-04-14', 'Kadıköy Sahne'],
  [8, 'Prodüksiyon 101', 'Başlangıç seviye müzik prodüksiyonu', '2024-04-28', 'Online - Ableton'],
  [8, 'Folk Jam Night', 'Geleneksel enstrümanlarla jam session', '2024-05-03', 'Beyoğlu Kültür Merkezi'],
  [9, 'Felsefe Kahvaltısı', 'Aylık felsefe tartışma buluşması', '2024-04-08', 'Bebek Kahvesi, İstanbul'],
  [9, 'Film ve Felsefe', 'Matrix filmi üzerinden felsefe tartışması', '2024-04-26', 'Sinema Salonu, Eskişehir'],
  [9, 'AI Etiği Semineri', 'Yapay zeka ve etik sorumluluk', '2024-05-15', 'Online - Zoom'],
  [10, 'Sunum Teknikleri', 'Etkili sunum yapma eğitimi', '2024-04-16', 'Online - Zoom'],
  [10, 'Podcast Workshop', 'Sıfırdan podcast oluşturma', '2024-05-03', 'Radyo Evi, Ankara'],
  [10, 'Beden Dili Workshop', 'Sözsüz iletişim ve sahne varlığı', '2024-04-20', 'Tiyatro Salonu, İstanbul'],
];

const mcChoices = ['a', 'b', 'c'];
const openTexts = [
  'Bu alanda kendimi geliştirmek istiyorum, yeni şeyler öğrenmek heyecan verici.',
  'Uzun süredir bu alanla ilgileniyorum ve çeşitli projelerimde deneyim kazandım. Özellikle pratik uygulamalar konusunda kendimi geliştirdim.',
  'Bu alandaki tutkum yıllar içinde büyük projelere dönüştü. Hem teorik hem pratik olarak derinlemesine bilgiye sahibim ve toplulukla paylaşmayı seviyorum.',
];

export function runSeed(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (count.c > 0) return;

  const insertUser = db.prepare('INSERT INTO users (name, age, city, bio, is_candidate) VALUES (?, ?, ?, ?, ?)');
  const insertInterest = db.prepare('INSERT INTO user_interests (user_id, area_key) VALUES (?, ?)');
  const insertAnswer = db.prepare('INSERT INTO quiz_answers (user_id, area_key, question_id, answer_type, answer_value, score) VALUES (?, ?, ?, ?, ?, ?)');
  const insertScore = db.prepare('INSERT INTO user_scores (user_id, area_key, score, tier) VALUES (?, ?, ?, ?)');
  const insertGroup = db.prepare('INSERT INTO groups (name, area_key, description, member_count) VALUES (?, ?, ?, ?)');
  const insertGroupMember = db.prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
  const insertMessage = db.prepare('INSERT INTO messages (group_id, user_id, content, created_at) VALUES (?, ?, ?, ?)');
  const insertEvent = db.prepare('INSERT INTO events (group_id, title, description, event_date, location) VALUES (?, ?, ?, ?, ?)');

  const transaction = db.transaction(() => {
    // Insert all 100 users
    for (let i = 0; i < USERS.length; i++) {
      const u = USERS[i];
      insertUser.run(u.name, u.age, u.city, u.bio, u.candidate ? 1 : 0);
      const userId = i + 1;

      for (const interest of u.interests) {
        insertInterest.run(userId, interest);
      }

      // Generate quiz answers and scores
      for (const areaKey of u.interests) {
        const skillLevel = u.candidate ? 2 : Math.floor(seededRandom(userId * 100 + AREA_KEYS.indexOf(areaKey)) * 3);
        let totalRaw = 0;

        for (let q = 1; q <= 3; q++) {
          const prefix = areaKey.slice(0, 3);
          const qid = `${prefix}-${q}`;
          const choice = mcChoices[skillLevel];
          const score = scoreAnswer(qid, 'multiple_choice', choice);
          insertAnswer.run(userId, areaKey, qid, 'multiple_choice', choice, score);
          totalRaw += score;
        }

        for (let q = 4; q <= 5; q++) {
          const prefix = areaKey.slice(0, 3);
          const qid = `${prefix}-${q}`;
          const likertVal = String(Math.min(5, skillLevel + 2 + Math.floor(seededRandom(userId * 200 + q) * 2)));
          const score = scoreAnswer(qid, 'likert', likertVal);
          insertAnswer.run(userId, areaKey, qid, 'likert', likertVal, score);
          totalRaw += score;
        }

        const prefix = areaKey.slice(0, 3);
        const qid = `${prefix}-6`;
        const openText = openTexts[skillLevel];
        const score = scoreAnswer(qid, 'open_ended', openText);
        insertAnswer.run(userId, areaKey, qid, 'open_ended', openText, score);
        totalRaw += score;

        const normalized = Math.round((totalRaw / 120) * 100);
        const clamped = Math.min(100, Math.max(0, normalized));
        const tier = getTier(clamped);
        insertScore.run(userId, areaKey, clamped, tier);
      }
    }

    // Create groups and assign members
    for (let g = 0; g < GROUPS.length; g++) {
      const group = GROUPS[g];
      const memberIds: number[] = [];
      for (let i = 0; i < USERS.length; i++) {
        if (USERS[i].interests.includes(group.area)) memberIds.push(i + 1);
      }
      insertGroup.run(group.name, group.area, group.desc, memberIds.length);
      const groupId = g + 1;
      for (const uid of memberIds) {
        insertGroupMember.run(groupId, uid);
      }

      // Insert chat messages for this group
      if (CHAT_MESSAGES[g]) {
        for (const msg of CHAT_MESSAGES[g]) {
          insertMessage.run(groupId, msg[0], msg[1], msg[2]);
        }
      }
    }

    // Insert events
    for (const evt of EVENTS) {
      insertEvent.run(evt[0], evt[1], evt[2], evt[3], evt[4]);
    }
  });

  transaction();
}
