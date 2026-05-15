export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function normalizeSymbol(s) {
  const u = s.trim().toUpperCase();
  if (u.includes('.')) return u;
  // BIST symbols are typically 4-5 uppercase letters with no vowels often (THYAO is exception)
  // Safer heuristic: if it's not a known US ticker pattern, try .IS
  // We'll just trust common conventions: AAPL, NVDA, TSLA, MSFT, GOOGL, AMZN, META are US
  const knownUS = ['AAPL','NVDA','TSLA','MSFT','GOOGL','GOOG','AMZN','META','AVGO','NFLX','AMD','INTC','BRK-B','JPM','V','MA','UNH','HD','PG','JNJ','XOM','CVX','WMT','BAC','PFE','KO','PEP','CSCO','ORCL','CRM','ADBE','QCOM','TXN','COST','MRK','ABBV','TMO','ABT','LLY','MCD','NKE','DIS','BA','GE','CAT','UPS','HON','LOW','MS','GS','AXP','BLK','SPGI','NOW','UBER','ABNB','PYPL','SHOP','SQ','PLTR','SOFI','RIVN','LCID','F','GM','T','VZ','CMCSA','TMUS'];
  if (knownUS.includes(u)) return u;
  // Default to BIST .IS suffix
  return u + '.IS';
}

async function fetchOne(sym) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) return { symbol: sym, error: 'http ' + r.status };
    const data = await r.json();
    const result = data?.chart?.result?.[0];
    if (!result) return { symbol: sym, error: 'no data' };
    const meta = result.meta || {};
    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose || meta.previousClose;
    const change = price - prev;
    const changePct = (change / prev) * 100;
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
  } catch (e) {
    return { symbol: sym, error: String(e) };
  }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get('s') || '').split(',').filter(Boolean).slice(0, 20);
  if (raw.length === 0) {
    return new Response(JSON.stringify({ error: 'no symbols' }), {
      status: 400, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }

  const symbols = raw.map(normalizeSymbol);
  const quotes = await Promise.all(symbols.map(fetchOne));

  return new Response(JSON.stringify({ quotes, ts: Date.now() }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=30, stale-while-revalidate=60',
      'access-control-allow-origin': '*'
    }
  });
}
