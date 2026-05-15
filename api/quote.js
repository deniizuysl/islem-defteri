export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const symbols = (url.searchParams.get('s') || '').split(',').filter(Boolean).slice(0, 20);
  if (symbols.length === 0) {
    return new Response(JSON.stringify({ error: 'no symbols' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const yfSyms = symbols.map(s => {
    const u = s.trim().toUpperCase();
    if (u.endsWith('.IS') || u.includes('.')) return u;
    if (/^[A-Z]{3,5}$/.test(u) && u.length >= 4 && /[AEIOU]/.test(u) === false) return u + '.IS';
    return u;
  });

  try {
    const yfUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yfSyms.join(','))}`;
    const r = await fetch(yfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    if (!r.ok) throw new Error('yf ' + r.status);
    const data = await r.json();
    const out = (data.quoteResponse?.result || []).map(q => ({
      symbol: q.symbol,
      shortName: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePct: q.regularMarketChangePercent,
      currency: q.currency,
      marketState: q.marketState,
      dayHigh: q.regularMarketDayHigh,
      dayLow: q.regularMarketDayLow,
      previousClose: q.regularMarketPreviousClose,
      volume: q.regularMarketVolume,
      time: q.regularMarketTime
    }));
    return new Response(JSON.stringify({ quotes: out, ts: Date.now() }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=30, stale-while-revalidate=60',
        'access-control-allow-origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
