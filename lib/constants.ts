import { Area, Question } from './types';

export const AREAS: Area[] = [
  { key: 'teknoloji', name: 'Teknoloji', icon: '💻', description: 'Yazılım, donanım ve dijital dünya' },
  { key: 'sanat', name: 'Sanat', icon: '🎨', description: 'Görsel sanatlar, müzik ve yaratıcılık' },
  { key: 'bilim', name: 'Bilim', icon: '🔬', description: 'Araştırma, keşif ve analitik düşünce' },
  { key: 'spor', name: 'Spor', icon: '⚽', description: 'Fiziksel aktivite ve rekabet' },
  { key: 'edebiyat', name: 'Edebiyat', icon: '📚', description: 'Okuma, yazma ve sözel ifade' },
  { key: 'girisimcilik', name: 'Girişimcilik', icon: '🚀', description: 'İş kurma, strateji ve liderlik' },
  { key: 'tasarim', name: 'Tasarım', icon: '✏️', description: 'UX/UI, grafik ve endüstriyel tasarım' },
  { key: 'muzik', name: 'Müzik', icon: '🎵', description: 'Enstrüman, prodüksiyon ve teori' },
  { key: 'felsefe', name: 'Felsefe', icon: '🧠', description: 'Düşünce, etik ve eleştirel analiz' },
  { key: 'iletisim', name: 'İletişim', icon: '🗣️', description: 'Hitabet, medya ve sosyal beceriler' },
];

export const TIERS = {
  explorer: { key: 'Keşfedici', min: 0, max: 40, color: '#94a3b8' },
  practitioner: { key: 'Uygulayıcı', min: 41, max: 70, color: '#0d9488' },
  expert: { key: 'Uzman', min: 71, max: 100, color: '#f59e0b' },
};

export function getTier(score: number): string {
  if (score <= 40) return 'Keşfedici';
  if (score <= 70) return 'Uygulayıcı';
  return 'Uzman';
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Uzman': return '#f59e0b';
    case 'Uygulayıcı': return '#0d9488';
    default: return '#94a3b8';
  }
}

export const QUESTIONS: Question[] = [
  // TEKNOLOJI
  { id: 'tek-1', area_key: 'teknoloji', type: 'multiple_choice', text: 'Bir web uygulaması geliştirirken hangi yaklaşımı tercih edersin?', options: [
    { label: 'Hazır şablon kullanırım', value: 'a', score: 5 },
    { label: 'Framework ile sıfırdan başlarım', value: 'b', score: 15 },
    { label: 'Kendi framework\'ümü yazarım', value: 'c', score: 20 },
  ]},
  { id: 'tek-2', area_key: 'teknoloji', type: 'multiple_choice', text: 'Yeni bir programlama dili öğrenmen gerekse nasıl başlarsın?', options: [
    { label: 'YouTube videoları izlerim', value: 'a', score: 5 },
    { label: 'Resmi dokümantasyonu okurum', value: 'b', score: 15 },
    { label: 'Hemen proje yaparak öğrenirim', value: 'c', score: 20 },
  ]},
  { id: 'tek-3', area_key: 'teknoloji', type: 'multiple_choice', text: 'Bir yazılım hatasını nasıl çözersin?', options: [
    { label: 'Stack Overflow\'dan kopyalarım', value: 'a', score: 5 },
    { label: 'Debugger ile adım adım takip ederim', value: 'b', score: 15 },
    { label: 'Log analizi ve root cause analizi yaparım', value: 'c', score: 20 },
  ]},
  { id: 'tek-4', area_key: 'teknoloji', type: 'likert', text: 'Açık kaynak projelere katkıda bulunma konusunda ne kadar deneyimlisin?' },
  { id: 'tek-5', area_key: 'teknoloji', type: 'likert', text: 'Sistem mimarisi tasarlama konusundaki yetkinliğini nasıl değerlendirirsin?' },
  { id: 'tek-6', area_key: 'teknoloji', type: 'open_ended', text: 'Şimdiye kadar geliştirdiğin en ilginç projeyi anlat.' },

  // SANAT
  { id: 'san-1', area_key: 'sanat', type: 'multiple_choice', text: 'Sanatsal çalışmalarında en çok hangi aracı kullanırsın?', options: [
    { label: 'Kalem ve kağıt', value: 'a', score: 10 },
    { label: 'Dijital araçlar (Photoshop, Procreate)', value: 'b', score: 15 },
    { label: 'Karışık teknikler ve deneysel malzemeler', value: 'c', score: 20 },
  ]},
  { id: 'san-2', area_key: 'sanat', type: 'multiple_choice', text: 'Bir sergi açsan teması ne olurdu?', options: [
    { label: 'Doğa ve manzara', value: 'a', score: 10 },
    { label: 'Toplumsal eleştiri', value: 'b', score: 15 },
    { label: 'Soyut ve kavramsal', value: 'c', score: 20 },
  ]},
  { id: 'san-3', area_key: 'sanat', type: 'multiple_choice', text: 'İlham kaynağın genellikle nereden gelir?', options: [
    { label: 'Başka sanatçıların eserlerinden', value: 'a', score: 10 },
    { label: 'Günlük yaşam gözlemlerimden', value: 'b', score: 15 },
    { label: 'İç dünyam ve bilinçaltımdan', value: 'c', score: 20 },
  ]},
  { id: 'san-4', area_key: 'sanat', type: 'likert', text: 'Farklı sanat akımları hakkındaki bilgin ne düzeyde?' },
  { id: 'san-5', area_key: 'sanat', type: 'likert', text: 'Kendi özgün sanatsal tarzını oluşturma konusunda ne kadar ilerleme kaydettin?' },
  { id: 'san-6', area_key: 'sanat', type: 'open_ended', text: 'Sanatın seni en çok etkileyen yönü nedir? Açıkla.' },

  // BILIM
  { id: 'bil-1', area_key: 'bilim', type: 'multiple_choice', text: 'Bilimsel bir probleme yaklaşımın nasıl?', options: [
    { label: 'Araştırma yapar, mevcut çözümleri incelerim', value: 'a', score: 10 },
    { label: 'Hipotez kurar, deney tasarlarım', value: 'b', score: 15 },
    { label: 'Disiplinler arası bağlantılar kurarım', value: 'c', score: 20 },
  ]},
  { id: 'bil-2', area_key: 'bilim', type: 'multiple_choice', text: 'Hangi bilim dalı seni en çok heyecanlandırır?', options: [
    { label: 'Biyoloji ve doğa bilimleri', value: 'a', score: 10 },
    { label: 'Fizik ve matematik', value: 'b', score: 15 },
    { label: 'Yapay zeka ve kuantum bilişim', value: 'c', score: 20 },
  ]},
  { id: 'bil-3', area_key: 'bilim', type: 'multiple_choice', text: 'Veri analizi konusundaki deneyimin?', options: [
    { label: 'Excel ile basit analizler', value: 'a', score: 5 },
    { label: 'Python/R ile istatistiksel analiz', value: 'b', score: 15 },
    { label: 'Makine öğrenmesi modelleri geliştirme', value: 'c', score: 20 },
  ]},
  { id: 'bil-4', area_key: 'bilim', type: 'likert', text: 'Bilimsel makale okuma ve anlama yetkinliğini nasıl değerlendirirsin?' },
  { id: 'bil-5', area_key: 'bilim', type: 'likert', text: 'Araştırma metodolojisi konusundaki deneyimini puanla.' },
  { id: 'bil-6', area_key: 'bilim', type: 'open_ended', text: 'Çözmek istediğin bilimsel bir problem var mı? Açıkla.' },

  // SPOR
  { id: 'spo-1', area_key: 'spor', type: 'multiple_choice', text: 'Sporu hayatında nasıl konumlandırırsın?', options: [
    { label: 'Hobi olarak, keyif için yaparım', value: 'a', score: 10 },
    { label: 'Düzenli antrenman programım var', value: 'b', score: 15 },
    { label: 'Yarışma/profesyonel seviyede ilgileniyorum', value: 'c', score: 20 },
  ]},
  { id: 'spo-2', area_key: 'spor', type: 'multiple_choice', text: 'Takım sporları mı bireysel sporlar mı?', options: [
    { label: 'Takım sporlarını tercih ederim', value: 'a', score: 10 },
    { label: 'Bireysel sporları tercih ederim', value: 'b', score: 15 },
    { label: 'İkisini de aktif olarak yaparım', value: 'c', score: 20 },
  ]},
  { id: 'spo-3', area_key: 'spor', type: 'multiple_choice', text: 'Antrenman planını nasıl oluşturursun?', options: [
    { label: 'İnternetten hazır program bulurum', value: 'a', score: 5 },
    { label: 'Koçumla birlikte planlarım', value: 'b', score: 15 },
    { label: 'Kendi performans verilerimi analiz ederek oluştururum', value: 'c', score: 20 },
  ]},
  { id: 'spo-4', area_key: 'spor', type: 'likert', text: 'Beslenme ve spor bilimi konusundaki bilgin ne düzeyde?' },
  { id: 'spo-5', area_key: 'spor', type: 'likert', text: 'Fiziksel dayanıklılığını nasıl değerlendirirsin?' },
  { id: 'spo-6', area_key: 'spor', type: 'open_ended', text: 'Spor hayatındaki en büyük başarını anlat.' },

  // EDEBIYAT
  { id: 'ede-1', area_key: 'edebiyat', type: 'multiple_choice', text: 'Okuma alışkanlığın nasıl?', options: [
    { label: 'Ayda 1-2 kitap okurum', value: 'a', score: 10 },
    { label: 'Haftada en az 1 kitap bitiririm', value: 'b', score: 15 },
    { label: 'Her gün birkaç saat okurum, notlar alırım', value: 'c', score: 20 },
  ]},
  { id: 'ede-2', area_key: 'edebiyat', type: 'multiple_choice', text: 'Yazma konusundaki deneyimin?', options: [
    { label: 'Günlük veya sosyal medya yazıları', value: 'a', score: 10 },
    { label: 'Öykü veya şiir yazıyorum', value: 'b', score: 15 },
    { label: 'Roman veya senaryo üzerinde çalışıyorum', value: 'c', score: 20 },
  ]},
  { id: 'ede-3', area_key: 'edebiyat', type: 'multiple_choice', text: 'Edebi eleştiri yapabilir misin?', options: [
    { label: 'Beğendim/beğenmedim düzeyinde', value: 'a', score: 5 },
    { label: 'Tema ve karakter analizi yapabilirim', value: 'b', score: 15 },
    { label: 'Edebi akım ve teknik analiz yapabilirim', value: 'c', score: 20 },
  ]},
  { id: 'ede-4', area_key: 'edebiyat', type: 'likert', text: 'Dünya edebiyatı klasiklerine hakimiyetin ne düzeyde?' },
  { id: 'ede-5', area_key: 'edebiyat', type: 'likert', text: 'Yaratıcı yazarlık becerini nasıl değerlendirirsin?' },
  { id: 'ede-6', area_key: 'edebiyat', type: 'open_ended', text: 'Seni en çok etkileyen kitabı ve nedenini anlat.' },

  // GIRISIMCILIK
  { id: 'gir-1', area_key: 'girisimcilik', type: 'multiple_choice', text: 'Bir iş fikrin olsa ilk adımın ne olur?', options: [
    { label: 'Arkadaşlarıma sorarım', value: 'a', score: 5 },
    { label: 'Pazar araştırması yaparım', value: 'b', score: 15 },
    { label: 'MVP yapıp test ederim', value: 'c', score: 20 },
  ]},
  { id: 'gir-2', area_key: 'girisimcilik', type: 'multiple_choice', text: 'Risk alma konusundaki tutumun?', options: [
    { label: 'Güvenli oynarım', value: 'a', score: 5 },
    { label: 'Hesaplı risk alırım', value: 'b', score: 15 },
    { label: 'Büyük düşünür, cesur adımlar atarım', value: 'c', score: 20 },
  ]},
  { id: 'gir-3', area_key: 'girisimcilik', type: 'multiple_choice', text: 'Ekip yönetimi deneyimin?', options: [
    { label: 'Ekip çalışmasına katılmışlığım var', value: 'a', score: 10 },
    { label: 'Küçük ekiplere liderlik ettim', value: 'b', score: 15 },
    { label: 'Birden fazla ekip ve projeyi yönettim', value: 'c', score: 20 },
  ]},
  { id: 'gir-4', area_key: 'girisimcilik', type: 'likert', text: 'Finansal okuryazarlık ve iş modeli bilgin ne düzeyde?' },
  { id: 'gir-5', area_key: 'girisimcilik', type: 'likert', text: 'Satış ve pazarlama becerilerini nasıl değerlendirirsin?' },
  { id: 'gir-6', area_key: 'girisimcilik', type: 'open_ended', text: 'Hayalindeki girişimi veya iş fikrini anlat.' },

  // TASARIM
  { id: 'tas-1', area_key: 'tasarim', type: 'multiple_choice', text: 'Tasarım sürecine nasıl başlarsın?', options: [
    { label: 'Referans görseller toplarım', value: 'a', score: 10 },
    { label: 'Kullanıcı araştırması yaparım', value: 'b', score: 15 },
    { label: 'Problem tanımı ve persona oluştururum', value: 'c', score: 20 },
  ]},
  { id: 'tas-2', area_key: 'tasarim', type: 'multiple_choice', text: 'Hangi tasarım araçlarını kullanıyorsun?', options: [
    { label: 'Canva veya basit araçlar', value: 'a', score: 5 },
    { label: 'Figma veya Sketch', value: 'b', score: 15 },
    { label: 'Figma + prototipleme + design system', value: 'c', score: 20 },
  ]},
  { id: 'tas-3', area_key: 'tasarim', type: 'multiple_choice', text: 'Tipografi ve renk teorisi bilgin?', options: [
    { label: 'Temel düzeyde bilgim var', value: 'a', score: 10 },
    { label: 'Bilinçli seçimler yapabilirim', value: 'b', score: 15 },
    { label: 'Kapsamlı bilgiye ve deneyime sahibim', value: 'c', score: 20 },
  ]},
  { id: 'tas-4', area_key: 'tasarim', type: 'likert', text: 'UX araştırma ve kullanılabilirlik testi deneyimini puanla.' },
  { id: 'tas-5', area_key: 'tasarim', type: 'likert', text: 'Tasarım sistemi oluşturma yetkinliğini nasıl değerlendirirsin?' },
  { id: 'tas-6', area_key: 'tasarim', type: 'open_ended', text: 'En gurur duyduğun tasarım çalışmanı anlat.' },

  // MUZIK
  { id: 'muz-1', area_key: 'muzik', type: 'multiple_choice', text: 'Müzikle ilişkin ne düzeyde?', options: [
    { label: 'Dinleyici olarak ilgilenirim', value: 'a', score: 5 },
    { label: 'Bir enstrüman çalıyorum', value: 'b', score: 15 },
    { label: 'Beste yapıyor veya prodüksiyon yapıyorum', value: 'c', score: 20 },
  ]},
  { id: 'muz-2', area_key: 'muzik', type: 'multiple_choice', text: 'Müzik teorisi bilgin?', options: [
    { label: 'Nota okuyamam', value: 'a', score: 5 },
    { label: 'Temel nota ve akor bilgim var', value: 'b', score: 15 },
    { label: 'Armoni, kontrpuan ve form analizi yapabilirim', value: 'c', score: 20 },
  ]},
  { id: 'muz-3', area_key: 'muzik', type: 'multiple_choice', text: 'Sahne deneyimin?', options: [
    { label: 'Hiç sahneye çıkmadım', value: 'a', score: 5 },
    { label: 'Birkaç kez sahneye çıktım', value: 'b', score: 15 },
    { label: 'Düzenli performans sergiliyorum', value: 'c', score: 20 },
  ]},
  { id: 'muz-4', area_key: 'muzik', type: 'likert', text: 'Farklı müzik türleri hakkındaki bilgini puanla.' },
  { id: 'muz-5', area_key: 'muzik', type: 'likert', text: 'Kulak eğitimi ve işitsel analiz yeteneğini değerlendir.' },
  { id: 'muz-6', area_key: 'muzik', type: 'open_ended', text: 'Müziğin hayatındaki yerini ve seni nasıl etkilediğini anlat.' },

  // FELSEFE
  { id: 'fel-1', area_key: 'felsefe', type: 'multiple_choice', text: 'Felsefi tartışmalara yaklaşımın nasıl?', options: [
    { label: 'İlgimi çeker ama derinlemesine bilmem', value: 'a', score: 10 },
    { label: 'Temel akımları ve düşünürleri bilirim', value: 'b', score: 15 },
    { label: 'Kendi felsefi pozisyonumu savunabilirim', value: 'c', score: 20 },
  ]},
  { id: 'fel-2', area_key: 'felsefe', type: 'multiple_choice', text: 'Etik ikilemlerle karşılaştığında?', options: [
    { label: 'Sezgilerime güvenirim', value: 'a', score: 10 },
    { label: 'Farklı etik çerçevelerle değerlendiririm', value: 'b', score: 15 },
    { label: 'Sistematik analiz yapar, argüman oluştururum', value: 'c', score: 20 },
  ]},
  { id: 'fel-3', area_key: 'felsefe', type: 'multiple_choice', text: 'Mantık ve eleştirel düşünme becerin?', options: [
    { label: 'Günlük hayatta mantıklı düşünmeye çalışırım', value: 'a', score: 10 },
    { label: 'Formal mantık temellerini bilirim', value: 'b', score: 15 },
    { label: 'Mantıksal yanılgıları tespit eder, argüman analizi yaparım', value: 'c', score: 20 },
  ]},
  { id: 'fel-4', area_key: 'felsefe', type: 'likert', text: 'Felsefe tarihi bilgini nasıl değerlendirirsin?' },
  { id: 'fel-5', area_key: 'felsefe', type: 'likert', text: 'Soyut kavramları analiz etme yeteneğini puanla.' },
  { id: 'fel-6', area_key: 'felsefe', type: 'open_ended', text: 'Seni en çok etkileyen felsefi fikir veya düşünür kimdir? Neden?' },

  // ILETISIM
  { id: 'ile-1', area_key: 'iletisim', type: 'multiple_choice', text: 'Topluluk önünde konuşma deneyimin?', options: [
    { label: 'Çok heyecanlanırım, kaçınırım', value: 'a', score: 5 },
    { label: 'Hazırlıklı olursam iyi sunum yaparım', value: 'b', score: 15 },
    { label: 'Doğaçlama dahil rahatça konuşurum', value: 'c', score: 20 },
  ]},
  { id: 'ile-2', area_key: 'iletisim', type: 'multiple_choice', text: 'İkna becerini nasıl tanımlarsın?', options: [
    { label: 'Genellikle başkalarına uyarım', value: 'a', score: 5 },
    { label: 'Mantıklı argümanlarla ikna edebilirim', value: 'b', score: 15 },
    { label: 'Hem mantık hem duygu ile etkili iletişim kurarım', value: 'c', score: 20 },
  ]},
  { id: 'ile-3', area_key: 'iletisim', type: 'multiple_choice', text: 'Yazılı iletişim becerin?', options: [
    { label: 'Mesaj ve e-posta yazarım', value: 'a', score: 5 },
    { label: 'Blog veya makale yazabilirim', value: 'b', score: 15 },
    { label: 'Profesyonel içerik üretirim', value: 'c', score: 20 },
  ]},
  { id: 'ile-4', area_key: 'iletisim', type: 'likert', text: 'Aktif dinleme ve empati becerini puanla.' },
  { id: 'ile-5', area_key: 'iletisim', type: 'likert', text: 'Çatışma çözme ve arabuluculuk yeteneğini değerlendir.' },
  { id: 'ile-6', area_key: 'iletisim', type: 'open_ended', text: 'İletişim becerilerinin sana en çok yardımcı olduğu bir durumu anlat.' },
];

export const AVATAR_OPTIONS = [
  'default', 'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5',
  'avatar6', 'avatar7', 'avatar8', 'avatar9', 'avatar10',
];

export const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
  'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Eskişehir', 'Trabzon',
];
