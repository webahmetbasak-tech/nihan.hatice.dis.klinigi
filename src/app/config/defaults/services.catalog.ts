import { ServiceConfig } from '../clinic.types';

/**
 * Varsayılan hizmet kataloğu.
 *
 * Metinler "tanıtım ve bilgilendirme" çerçevesinde yazılmıştır:
 * fiyat, garanti, "en iyi / uzman / ağrısız / tek seansta" gibi üstünlük ya da sonuç vaadi,
 * önce-sonra ve hasta yorumu İÇERMEZ (1219 s. Kanun md. 40, ADSH Yönetmeliği md. 24).
 * Klinik config'lerinde `services.overrides` ile alan bazlı değiştirilebilir.
 */

const img = (id: string, code: string, alt: string) => ({
  src: `/images/shared/services/${id}.webp`,
  avif: `/images/shared/services/${id}.avif`,
  alt,
  width: 1200,
  height: 1500,
  code,
});

export const SERVICE_CATALOG: ServiceConfig[] = [
  {
    id: 'implant',
    enabled: true,
    title: 'İmplant Tedavisi',
    shortTitle: 'İmplant',
    discipline: 'Protetik & Cerrahi',
    concern: 'Eksik dişlerim var',
    summary:
      'Eksik dişlerin yerine, çene kemiğine yerleştirilen yapay kökler üzerine yapılan sabit protezlerle çözüm arayan tedavi yöntemi.',
    description: [
      'İmplant; kaybedilen diş kökünün yerini alan, biyouyumlu malzemeden üretilmiş yapay bir köktür. Kemikle bütünleşme süreci tamamlandıktan sonra üzerine kron ya da köprü gibi protezler yapılır.',
      'Uygulamanın mümkün olup olmadığı; kemik hacmi, genel sağlık durumu ve ağız hijyeni gibi etkenlere göre, muayene ve görüntüleme sonrasında hekim tarafından değerlendirilir.',
    ],
    highlights: [
      'Klinik muayene ve radyografik değerlendirme',
      'Kemik yapısına göre planlama',
      'İyileşme sürecinde kontrol randevuları',
      'Üst yapı (kron / köprü) planlaması',
    ],
    steps: [
      { title: 'Değerlendirme', description: 'Muayene ve görüntüleme ile kemik yapısı incelenir.' },
      { title: 'Yerleştirme', description: 'İmplant, lokal anestezi altında planlanan bölgeye yerleştirilir.' },
      { title: 'İyileşme', description: 'Kemikle bütünleşme için hekimin belirlediği süre beklenir.' },
      { title: 'Üst yapı', description: 'Ölçü alınır ve protez diş yerleştirilir.' },
    ],
    duration:
      'Kemik iyileşmesine bağlı olarak süreç genellikle birkaç ay sürer; size özel süre muayene sonrasında belirlenir.',
    appointmentType: 'Muayene ve implant planlaması',
    sessionMinutes: 30,
    price: null,
    doctorIds: [],
    icon: 'implant',
    image: img('implant', 'SRV-IMPLANT-01', 'Çene modeli üzerinde implant ve kron'),
    keywords: ['implant', 'implent', 'vida', 'eksik diş', 'diş eksik', 'diş kaybı', 'kayıp diş', 'dişsiz', 'köprü', 'protez'],
    faq: [
      {
        q: 'İmplant herkes için uygun mu?',
        a: 'Uygunluk; kemik yapısı, genel sağlık durumu ve alışkanlıklar gibi etkenlere göre değişir. Karar, muayene ve görüntüleme sonrasında hekim tarafından verilir.',
      },
      {
        q: 'İlk randevuda ne yapılır?',
        a: 'Ağız içi muayene yapılır, gerekli görülürse görüntüleme istenir ve olası seçenekler size açıklanır.',
      },
    ],
  },
  {
    id: 'smile-design',
    enabled: true,
    title: 'Gülüş Tasarımı',
    shortTitle: 'Gülüş Tasarımı',
    discipline: 'Estetik Diş Hekimliği',
    concern: 'Gülüşümden memnun değilim',
    summary:
      'Diş, dudak ve yüz oranlarının birlikte değerlendirildiği; gülüşün estetik ve fonksiyonel olarak planlandığı kişiye özel süreç.',
    description: [
      'Gülüş tasarımı tek bir işlem değil, bir planlama yaklaşımıdır. Dişlerin rengi, boyu, dizilimi ve diş eti çizgisi; yüz hatları ve konuşma sırasındaki görünümle birlikte ele alınır.',
      'Planlama sonucunda beyazlatma, lamina, zirkonyum, ortodonti veya diş eti düzenlemesi gibi uygulamalardan biri ya da birkaçı önerilebilir. Uygulanacak yöntem, muayene sonrasında sizinle birlikte kararlaştırılır.',
    ],
    highlights: [
      'Fotoğraf ve ölçüye dayalı analiz',
      'Dijital ön planlama',
      'Yüz oranlarıyla uyum değerlendirmesi',
      'Uygulama seçeneklerinin karşılaştırılması',
    ],
    steps: [
      { title: 'Analiz', description: 'Fotoğraf ve ölçülerle mevcut gülüş incelenir.' },
      { title: 'Tasarım', description: 'Oranlar dijital ortamda planlanır.' },
      { title: 'Prova', description: 'Uygun vakalarda geçici prova ile görünüm birlikte değerlendirilir.' },
      { title: 'Uygulama', description: 'Onaylanan plan seanslara bölünerek uygulanır.' },
    ],
    duration: 'Seçilen yöntemlere göre birkaç randevudan birkaç aya kadar değişebilir.',
    appointmentType: 'Estetik analiz ve planlama görüşmesi',
    sessionMinutes: 45,
    price: null,
    doctorIds: [],
    icon: 'smile',
    image: img('smile-design', 'SRV-SMILE-01', 'Doğal bir gülümseme, yakın plan'),
    keywords: ['gülüş', 'gulus', 'gülüş tasarımı', 'smile', 'estetik', 'hollywood', 'diş estetiği', 'gülüşüm', 'görünüm'],
    faq: [
      {
        q: 'Gülüş tasarımında hangi uygulamalar yapılır?',
        a: 'Planlamaya göre beyazlatma, lamina, zirkonyum, ortodonti ya da diş eti düzenlemesi gibi farklı uygulamalar gündeme gelebilir. Hangisinin uygun olduğu muayenede belirlenir.',
      },
    ],
  },
  {
    id: 'endodontics',
    enabled: true,
    title: 'Kanal Tedavisi (Endodonti)',
    shortTitle: 'Kanal Tedavisi',
    discipline: 'Endodonti',
    concern: 'Dişim ağrıyor ya da hassaslaştı',
    summary:
      'Dişin iç kısmındaki pulpa dokusunun etkilendiği durumlarda, dişi ağızda tutmayı amaçlayan tedavi yöntemi.',
    description: [
      'Derin çürük, çatlak veya travma sonucu dişin sinir ve damarlarını barındıran pulpa dokusu etkilenebilir. Kanal tedavisinde bu doku temizlenir, kanallar şekillendirilir ve özel dolgu maddeleriyle doldurulur.',
      'Tedavi sonrasında dişin dayanıklılığını korumak için dolgu ya da kron gibi bir üst restorasyon önerilebilir. Seans sayısı dişin durumuna göre hekim tarafından belirlenir.',
    ],
    highlights: [
      'Klinik ve radyografik değerlendirme',
      'Lokal anestezi altında uygulama',
      'Kanalların temizlenmesi ve doldurulması',
      'Üst restorasyon planlaması',
    ],
    steps: [
      { title: 'Teşhis', description: 'Muayene ve röntgen ile dişin durumu değerlendirilir.' },
      { title: 'Temizlik', description: 'Etkilenen pulpa dokusu uzaklaştırılır.' },
      { title: 'Dolgu', description: 'Kanallar şekillendirilir ve doldurulur.' },
      { title: 'Restorasyon', description: 'Diş, dolgu veya kron ile korunur.' },
    ],
    duration: 'Dişin durumuna göre bir veya birden fazla seansta tamamlanabilir.',
    appointmentType: 'Muayene ve kanal tedavisi değerlendirmesi',
    sessionMinutes: 30,
    price: null,
    doctorIds: [],
    icon: 'canal',
    image: img('endodontics', 'SRV-ENDO-01', 'Hekim ışıklı panoda diş röntgenlerini inceliyor'),
    keywords: ['kanal', 'kanal tedavisi', 'endodonti', 'sinir', 'kök', 'dolgu', 'çürük', 'curuk'],
    faq: [
      {
        q: 'Kanal tedavisi kaç seans sürer?',
        a: 'Dişin durumuna, kanal sayısına ve enfeksiyonun varlığına göre değişir. Seans planı muayene sonrasında paylaşılır.',
      },
    ],
  },
  {
    id: 'whitening',
    enabled: true,
    title: 'Diş Beyazlatma',
    shortTitle: 'Beyazlatma',
    discipline: 'Estetik Diş Hekimliği',
    concern: 'Dişlerimin rengi koyulaştı',
    summary: 'Diş renginin, hekim kontrolünde uygulanan beyazlatma jelleriyle açılmasını amaçlayan estetik uygulama.',
    description: [
      'Kahve, çay, sigara veya yaşa bağlı renk değişimleri dişlerin daha koyu görünmesine neden olabilir. Beyazlatma öncesinde diş ve diş eti sağlığı kontrol edilir; uygun görülürse klinik tipi veya ev tipi yöntem planlanır.',
      'Sonuç ve kalıcılık; dişin yapısına, mevcut renk tonuna ve beslenme alışkanlıklarına göre kişiden kişiye farklılık gösterir. Dolgu ve kaplamaların rengi beyazlatma ile değişmez.',
    ],
    highlights: [
      'Ön muayene ve renk tespiti',
      'Klinik veya ev tipi yöntem değerlendirmesi',
      'Diş eti koruma uygulaması',
      'Hassasiyet ve bakım bilgilendirmesi',
    ],
    steps: [
      { title: 'Kontrol', description: 'Diş ve diş eti sağlığı değerlendirilir.' },
      { title: 'Renk tespiti', description: 'Başlangıç tonu kayıt altına alınır.' },
      { title: 'Uygulama', description: 'Seçilen yöntem hekim kontrolünde uygulanır.' },
      { title: 'Bakım', description: 'Rengin korunmasına yönelik öneriler paylaşılır.' },
    ],
    duration: 'Uygulama şekline göre değişir; klinik ve ev tipi yöntemlerin süreleri muayenede açıklanır.',
    appointmentType: 'Beyazlatma ön muayenesi',
    sessionMinutes: 30,
    price: null,
    doctorIds: [],
    icon: 'whitening',
    image: img('whitening', 'SRV-WHITE-01', 'Gülümseyen bir kişinin dişleri, yakın plan'),
    keywords: ['beyazlatma', 'beyazlat', 'bleaching', 'sararma', 'sarı', 'renk', 'leke', 'diş rengi', 'beyaz'],
    faq: [
      {
        q: 'Beyazlatma dolgu ve kaplamaların rengini değiştirir mi?',
        a: 'Hayır. Beyazlatma doğal diş dokusunu etkiler; mevcut dolgu ve kaplamaların rengi değişmez. Bu durum planlamada dikkate alınır.',
      },
    ],
  },
  {
    id: 'orthodontics',
    enabled: true,
    title: 'Ortodonti — Telsiz Şeffaf Plak',
    shortTitle: 'Şeffaf Plak',
    discipline: 'Ortodonti',
    concern: 'Dişlerim çapraşık',
    summary:
      'Diş çapraşıklıklarının ve dizilim bozukluklarının, kişiye özel üretilen şeffaf plaklarla düzeltilmesini amaçlayan ortodontik yöntem.',
    description: [
      'Şeffaf plak tedavisinde dişlerin hareketi dijital ortamda planlanır ve bu plana göre üretilen plak serisi belirli aralıklarla değiştirilir. Plaklar yemek ve fırçalama sırasında çıkarılabilir.',
      'Her ortodontik durum şeffaf plak ile tedavi edilemeyebilir. Uygunluk, ortodontik muayene ve kayıtlar alındıktan sonra değerlendirilir. Planlanan sonuca ulaşılabilmesi için plakların önerilen süre boyunca takılması önemlidir.',
    ],
    highlights: [
      'Ortodontik muayene ve kayıt',
      'Dijital hareket planlaması',
      'Plak değişim takvimi',
      'Tedavi sonrası pekiştirme planı',
    ],
    steps: [
      { title: 'Kayıt', description: 'Muayene yapılır; fotoğraf ve ölçü ya da tarama alınır.' },
      { title: 'Planlama', description: 'Diş hareketleri dijital olarak planlanır.' },
      { title: 'Plaklar', description: 'Plak serisi belirlenen aralıklarla değiştirilir.' },
      { title: 'Pekiştirme', description: 'Sonucu korumak için pekiştirme aygıtı kullanılır.' },
    ],
    duration: 'Çapraşıklığın derecesine göre değişir; tahmini süre planlama aşamasında paylaşılır.',
    appointmentType: 'Ortodontik muayene ve kayıt',
    sessionMinutes: 45,
    price: null,
    doctorIds: [],
    icon: 'aligner',
    image: img('orthodontics', 'SRV-ORTHO-01', 'Şeffaf plağını takan bir kişi'),
    keywords: ['ortodonti', 'şeffaf plak', 'seffaf plak', 'plak', 'telsiz', 'diş teli', 'tel tak', 'çapraşık', 'çarpık', 'eğri', 'aligner', 'dizilim'],
    faq: [
      {
        q: 'Şeffaf plak her çapraşıklıkta kullanılabilir mi?',
        a: 'Her durumda uygun olmayabilir. Ortodontik muayene ve kayıtlar değerlendirildikten sonra en uygun yöntem hekiminiz tarafından açıklanır.',
      },
    ],
  },
  {
    id: 'zirconium-laminate',
    enabled: true,
    title: 'Zirkonyum & Lamina Kaplama',
    shortTitle: 'Zirkonyum & Lamina',
    discipline: 'Protetik & Estetik',
    concern: 'Dişlerim kırık, aşınmış ya da renksiz',
    summary:
      'Dişlerin form, renk ve dayanıklılık açısından yeniden düzenlenmesi için kullanılan seramik esaslı kaplama seçenekleri.',
    description: [
      'Zirkonyum kaplamalar metal alt yapı içermeyen, dişin tamamını saran kron restorasyonlarıdır. Lamina (yaprak porselen) ise genellikle dişin ön yüzeyine uygulanan ince seramik tabakalardır.',
      'Hangi seçeneğin uygun olduğu; dişin mevcut yapısı, kapanış ilişkisi ve estetik beklentiye göre değerlendirilir. Uygulama öncesinde dişlerde yapılacak hazırlığın kapsamı hekim tarafından açıklanır.',
    ],
    highlights: [
      'Kapanış ve diş yapısı analizi',
      'Renk ve form seçimi',
      'Geçici restorasyonla prova',
      'Kontrol ve bakım bilgilendirmesi',
    ],
    steps: [
      { title: 'Analiz', description: 'Dişler ve kapanış ilişkisi değerlendirilir.' },
      { title: 'Hazırlık', description: 'Plana göre dişler hazırlanır ve ölçü alınır.' },
      { title: 'Prova', description: 'Form ve renk birlikte kontrol edilir.' },
      { title: 'Uygulama', description: 'Kaplamalar yerleştirilir ve kapanış kontrol edilir.' },
    ],
    duration: 'Laboratuvar süreciyle birlikte genellikle birkaç randevuda tamamlanır.',
    appointmentType: 'Estetik muayene ve kaplama planlaması',
    sessionMinutes: 45,
    price: null,
    doctorIds: [],
    icon: 'veneer',
    image: img('zirconium-laminate', 'SRV-VENEER-01', 'Koyu zemin üzerinde porselen kron'),
    keywords: ['zirkonyum', 'zirkon', 'lamina', 'yaprak porselen', 'porselen', 'kaplama', 'kron', 'veneer', 'emax', 'e-max'],
    faq: [
      {
        q: 'Zirkonyum ile lamina arasındaki fark nedir?',
        a: 'Zirkonyum dişin tamamını saran bir kron restorasyonudur; lamina ise çoğunlukla dişin ön yüzeyine uygulanan ince bir seramik tabakadır. Hangisinin uygun olduğu dişin yapısına göre belirlenir.',
      },
    ],
  },
  {
    id: 'pedodontics',
    enabled: true,
    title: 'Pedodonti',
    shortTitle: 'Pedodonti',
    discipline: 'Çocuk Diş Hekimliği',
    concern: 'Çocuğumun dişleri için',
    summary:
      'Bebeklik döneminden ergenliğe kadar çocukların ağız ve diş sağlığının takibine ve korunmasına yönelik hizmetler.',
    description: [
      'Çocuklarda diş hekimi ziyaretleri, koruyucu uygulamalar ve sağlıklı alışkanlıkların kazanılması açısından önemlidir. Süt dişlerinin sağlığı, kalıcı dişlerin doğru konumlanmasını da etkiler.',
      'Randevular çocuğun yaşına ve uyum düzeyine göre planlanır. Flor ve fissür örtücü gibi koruyucu uygulamalar ile gerekli tedaviler, hekim değerlendirmesinin ardından ebeveyne açıklanır.',
    ],
    highlights: [
      'Yaşa uygun muayene',
      'Koruyucu uygulama değerlendirmesi',
      'Ebeveyn bilgilendirmesi',
      'Düzenli kontrol takvimi',
    ],
    steps: [
      { title: 'Tanışma', description: 'Çocuğun ortama alışması için kısa bir tanışma yapılır.' },
      { title: 'Muayene', description: 'Diş ve çene gelişimi değerlendirilir.' },
      { title: 'Koruma', description: 'Gerekli koruyucu uygulamalar planlanır.' },
      { title: 'Takip', description: 'Düzenli kontrol aralıkları belirlenir.' },
    ],
    duration: 'Kontrol randevuları genellikle kısa sürer; tedavi gereken durumlarda plan ayrıca oluşturulur.',
    appointmentType: 'Çocuk diş hekimliği muayenesi',
    sessionMinutes: 30,
    price: null,
    doctorIds: [],
    icon: 'child',
    image: img('pedodontics', 'SRV-PEDO-01', 'Diş hekimi koltuğunda muayene olan çocuk'),
    keywords: ['çocuk', 'cocuk', 'çocuğum', 'pedodonti', 'bebek', 'süt dişi', 'oğlum', 'kızım', 'fissür', 'flor'],
    faq: [
      {
        q: 'Çocuğumu ilk kez ne zaman diş hekimine götürmeliyim?',
        a: 'Genel öneri, ilk dişin sürmesiyle birlikte ya da bir yaş civarında ilk kontrolün yapılmasıdır. Çocuğunuza özel takvim hekim tarafından belirlenir.',
      },
    ],
  },
];
