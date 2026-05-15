export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function tryFetch(sym) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const result = data?.chart?.result?.[0];
    if (!result || !result.meta) return null;
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    if (price == null) return null;
    const prev = meta.chartPreviousClose || meta.previousClose;
    const change = price - prev;
    const changePct = prev ? (change / prev) * 100 : 0;
    return {
      symbol: sym,
      shortName: meta.shortName || meta.longName || sym,
      price,
      change,
      changePct,
      currency: meta.currency,
      marketState: meta.marketState || '',
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      previousClose: prev,
      volume: meta.regularMarketVolume,
      time: meta.regularMarketTime
    };
  } catch (e) { return null; }
}

async function fetchOne(rawSym) {
  const sym = rawSym.trim().toUpperCase();

  // 1. If user already specified .IS or another exchange suffix, use it directly
  if (sym.includes('.')) {
    const r = await tryFetch(sym);
    return r || { symbol: sym, error: 'no data' };
  }

  // 2. Try as-is first (covers all US tickers — common case)
  let r = await tryFetch(sym);
  if (r) return r;

  // 3. Fallback: try with .IS suffix (BIST)
  r = await tryFetch(sym + '.IS');
  if (r) return r;

  return { symbol: sym, error: 'no data' };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get('s') || '').split(',').filter(Boolean).slice(0, 20);
  if (raw.length === 0) {
    return new Response(JSON.stringify({ error: 'no symbols' }), {
      status: 400, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }

  const quotes = await Promise.all(raw.map(fetchOne));

  return new Response(JSON.stringify({ quotes, ts: Date.now() }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=30, stale-while-revalidate=60',
      'access-control-allow-origin': '*'
    }
  });
}
