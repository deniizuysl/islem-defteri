export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const DEFAULT_WATCHLIST = ['THYAO.IS', 'ASELS.IS', 'TUPRS.IS', 'KCHOL.IS', 'AAPL', 'NVDA', 'TSLA', 'MSFT'];

const EVENTS = [
  { date: '2026-05-22', time: '14:00', country: 'TR', name: 'TCMB Faiz Kararı', impact: 'high', note: 'TÜFE trend yorumu kritik.' },
  { date: '2026-05-22', time: '15:30', country: 'TR', name: 'TCMB PPK Toplantı Özeti', impact: 'medium', note: '' },
  { date: '2026-05-28', time: '15:30', country: 'US', name: 'Q1 GDP (İkinci Tahmin)', impact: 'medium', note: '' },
  { date: '2026-05-29', time: '15:30', country: 'US', name: 'Core PCE (Nisan)', impact: 'high', note: 'Fed enflasyon tercihi.' },
  { date: '2026-06-02', time: '17:00', country: 'US', name: 'ISM Manufacturing (Mayıs)', impact: 'medium', note: '' },
  { date: '2026-06-03', time: '10:00', country: 'TR', name: 'TÜFE & ÜFE (Mayıs)', impact: 'high', note: 'TCMB Haziran toplantısının ana girdisi.' },
  { date: '2026-06-05', time: '15:30', country: 'US', name: 'Non-Farm Payrolls (Mayıs)', impact: 'high', note: 'İstihdam + işsizlik.' },
  { date: '2026-06-11', time: '10:00', country: 'TR', name: 'Cari İşlemler Dengesi (Nisan)', impact: 'medium', note: '' },
  { date: '2026-06-11', time: '15:30', country: 'US', name: 'ABD CPI (Mayıs)', impact: 'high', note: 'FOMC öncesi son enflasyon.' },
  { date: '2026-06-12', time: '10:00', country: 'TR', name: 'Sanayi Üretimi (Nisan)', impact: 'low', note: '' },
  { date: '2026-06-15', time: '10:00', country: 'TR', name: 'İşsizlik Oranı (Mart)', impact: 'low', note: '' },
  { date: '2026-06-17', time: '15:30', country: 'US', name: 'Perakende Satışlar (Mayıs)', impact: 'medium', note: '' },
  { date: '2026-06-17', time: '21:00', country: 'US', name: 'Fed FOMC Faiz Kararı', impact: 'high', note: 'Powell basın toplantısı 21:30. Yıl ortası dot plot revizyonu.' },
  { date: '2026-06-19', time: '17:00', country: 'US', name: 'Quad Witching (Opsiyon Vade)', impact: 'medium', note: '' },
  { date: '2026-06-26', time: '14:00', country: 'TR', name: 'TCMB Faiz Kararı', impact: 'high', note: '' },
  { date: '2026-06-26', time: '15:30', country: 'US', name: 'Core PCE (Mayıs)', impact: 'high', note: '' }
];

const CONCEPTS = [
  ['Yarın yükseleni sabah seçemezsin', 'Piyasaya ulaşan bilgi zaten fiyatlanmıştır. Sezgiyle yarının kazananını seçmeyi bütün dünya başaramıyor — sen başarmaya çalışmak yerine zamanı dostun yap.'],
  ['Compounding — bileşik etkisi', '%10 yıllık getiri 7 yılda parayı ikiye katlar. Compounding\'in gücü son yıllarda belirir. Aynı sebepten %50 kayıp telafi için %100 kazanç gerekir.'],
  ['Recency bias', 'İnsan beyni son 1-2 yılı geleceğe yansıtır. Bir yatırımcının doğru sorusu: "Geçen yıl ne kazandı?" değil, "30 yıllık ortalaması ve dağılımı ne?"'],
  ['Diversifikasyon', 'Tek hisseye %100 yatırım, tüm yumurtaları tek sepete koymak. 15-20 hissenin üzerinde idiosyncratic risk büyük ölçüde yok olur. Endeks fonu en pratik yol.'],
  ['DCA — düzenli alım', 'Aynı tutarı düzenli aralıklarla yatır. Düşüşte daha çok pay alırsın, yükselişte daha az. Timing\'in yenildiği ender stratejilerden biri.'],
  ['Mean reversion', 'Aşırı yükselen veya düşen fiyatlar uzun vadede ortalamaya döner. "Top gainer\'ı al" stratejisi negatif EV üretmesinin sebebi bu.'],
  ['P/E oranı', 'Fiyat/yıllık kâr. Nasdaq 100 medyan PE 24, şu an 38. Yüksek PE sonrası 10 yıllık getiri tarihsel olarak düşük gelmiş.'],
  ['Yield curve', 'Tahvil faizinin vade boyunca dağılımı. Tersine döndüğünde (inversion) tarihsel olarak resesyonu önceler — son 50 yılda 9/9.'],
  ['VIX — korku endeksi', 'S&P 500 opsiyon volatilitesi. Normal 12-20, panik 30+, kriz 50+. VIX zirvesi tarihsel olarak alım fırsatı.'],
  ['Drawdown — geri çekilme', 'Zirveden dibe kayıp yüzdesi. Maks drawdown stratejinin gerçek risk göstergesi. %50 drawdown\'ı az insan psikolojik olarak taşıyabilir.'],
  ['Sharpe ratio', '(Getiri - risksiz faiz) / volatilite. Sharpe 1: iyi, 2: çok iyi, 3+: olağanüstü. Risk-ayarlı getiri profesyonel bakış.'],
  ['Kelly Criterion', 'Optimal pozisyon büyüklüğü = (kazanma oranı × ödül - kayıp oranı × kayıp) / ödül. Yarısını veya çeyreğini kullanmak daha güvenli.'],
  ['Black Swan', 'Önceden öngörülemeyen, etkisi büyük olay. Modelin "imkansız" dediği şey 10 yılda bir gerçekleşir. Portföyün hayatta kalması, getirisinden önce gelir.'],
  ['Carry trade', 'Düşük faizliden borçlan, yüksek faizliye yatır. Yıllarca para basar, sonra kur döner ve hepsini siler. TL klasik carry hedefi.'],
  ['PMI', 'Satın alma yöneticileri endeksi. 50 üstü genişleme, altı daralma. Resesyonu 3-6 ay önceler.'],
  ['Marjinal alıcı', 'Bir varlığın fiyatını "en son alıcı" belirler — ortalama alıcı değil. Bu yüzden küçük marjinal hareketle büyük fiyat değişimi olur.'],
  ['Survivorship bias', '"Şu fon 20 yıldır endeksi yenmiş" yanıltıcıdır: kaybeden fonlar kapanmış, sadece kazanan sayılıyor.'],
  ['Hisseyi neden tutarsın?', 'Cevap "yükselsin diye" ise stratejin yok. Değer tezi, kalite tezi, makro tez — biri olmalı. Tez yoksa çıkış da yok.'],
  ['Stop-loss disiplini', 'Pozisyonu açmadan önce nerede yanlış olduğunu belirle. Çizgi geçilince duygu girmesin — profesyoneli amatörden ayıran tek davranış.'],
  ['Asimetrik bahis', '%10 risk, %50 potansiyel pozisyonlar. Win rate %40 olsa bile pozitif EV. Buffett ve Munger\'in matematiği.'],
  ['Korelasyon ≠ nedensellik', '"X yükseldiğinde Y de yükseldi" iki şeyin nedensel bağlantılı olduğunu göstermez. Üçüncü değişken (faiz, dolar) ikisini birden hareket ettiriyor olabilir.'],
  ['Faiz — paranın zaman değeri', 'Faiz yükseldiğinde hisse değerlemeleri düşer. 2022 düşüşünün ana sebebi Fed\'in faizi sıfırdan %5\'e çıkarması.'],
  ['Enflasyon ve reel getiri', 'Nominal %50, enflasyon %50 → reel %0. Türkiye\'de nominal rakamlar yanıltıcı. Satın alma gücü ölç.'],
  ['Volatilite ≠ risk', 'Akademik finans volatiliteyi risk sayar ama uzun vadeli yatırımcı için kalıcı kayıp risktir. Buffett: "Volatilite fırsat, risk değil."'],
  ['Endeks fonu', 'Piyasanın tamamını sahip olma. Çoğu aktif fon endeksi yenemez (15 yıl: %85 kaybeder). S&P 500 endeks fonu Buffett\'in eşine bıraktığı portföyün %90\'ı.'],
  ['TER — yıllık fon ücreti', '%0.5 ile %2 fon arasında 30 yılda bileşik fark portföyün %30\'una yakın. En düşük TER\'li fonu seç.'],
  ['Rebalancing', 'Hedef dağılım %60 hisse %40 tahvil. Hisse %80\'e çıkınca sat, tahvile geç. Mekanik kural duygudan bağımsız "yükselende sat, düşende al" yapar.'],
  ['Margin / kaldıraç', 'Borç para ile yatırım. Kazancı + kaybı katlar VE pozisyonu zorla kapattırır. Pozitif EV stratejiniz olsa bile kaldıraç iflas ettirebilir.'],
  ['Insider buying', 'Şirket CEO/CFO\'sunun kendi parasıyla hisse alması güçlü sinyal. Akademik çalışmalar küçük ama anlamlı outperformance gösteriyor.'],
  ['Buy-and-hold', '20 yılın en iyi 10 gününü kaçırırsan getirinin yarısı silinir. En iyi günler kötü günlerin etrafında yoğunlaşır. "Time in market beats timing the market."']
];

async function fetchQuote(symbol) {
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose || meta.previousClose;
    const changePct = ((price - prev) / prev) * 100;
    return { symbol: symbol.replace('.IS', ''), price, changePct, currency: meta.currency };
  } catch (e) { return null; }
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function buildMessage(quotes, todayEvents, concept) {
  const dt = new Date();
  const dStr = dt.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' });

  let msg = `🌅 *Sabah Brief — ${dStr}*\n\n`;

  if (todayEvents.length > 0) {
    msg += `📅 *Bugünün olayları:*\n`;
    todayEvents.forEach(e => {
      const flag = e.country === 'TR' ? '🇹🇷' : '🇺🇸';
      const dot = e.impact === 'high' ? '🔴' : e.impact === 'medium' ? '🟡' : '⚪';
      msg += `${dot} ${flag} ${e.time} — ${e.name}${e.note ? '\n_' + e.note + '_' : ''}\n`;
    });
    msg += `\n`;
  }

  const valid = quotes.filter(q => q && !isNaN(q.changePct));
  if (valid.length > 0) {
    const sorted = [...valid].sort((a, b) => b.changePct - a.changePct);
    msg += `📈 *Watchlist hareketler:*\n`;
    sorted.slice(0, 3).forEach(q => {
      const sym = q.currency === 'TRY' ? '₺' : '$';
      msg += `+${q.changePct.toFixed(2)}%  ${q.symbol}  ${sym}${q.price.toFixed(2)}\n`;
    });
    const losers = sorted.slice(-3).reverse();
    losers.forEach(q => {
      if (q.changePct >= 0) return;
      const sym = q.currency === 'TRY' ? '₺' : '$';
      msg += `${q.changePct.toFixed(2)}%  ${q.symbol}  ${sym}${q.price.toFixed(2)}\n`;
    });
    msg += `\n`;
  }

  if (concept) {
    msg += `💡 *Bugünün kavramı: ${concept[0]}*\n${concept[1]}\n\n`;
  }

  msg += `_İşlem Defteri · islem-defteri.vercel.app_`;
  return msg;
}

async function sendTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return { error: 'env yok' };
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  });
  return { status: r.status, body: await r.text() };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const test = url.searchParams.get('test') === '1';

  const quotes = await Promise.all(DEFAULT_WATCHLIST.map(fetchQuote));

  const today = todayISO();
  const todayEvents = EVENTS.filter(e => e.date === today);

  const dayIdx = Math.floor(Date.now() / 86400000) % CONCEPTS.length;
  const concept = CONCEPTS[dayIdx];

  const message = buildMessage(quotes, todayEvents, concept);

  if (test) {
    return new Response(JSON.stringify({ preview: message, today, todayEvents, concept }), {
      status: 200, headers: { 'content-type': 'application/json' }
    });
  }

  const tgRes = await sendTelegram(message);
  return new Response(JSON.stringify({ sent: true, telegram: tgRes }), {
    status: 200, headers: { 'content-type': 'application/json' }
  });
}
