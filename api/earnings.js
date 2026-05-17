export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchEarnings(sym) {
  try {
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(sym)}?modules=calendarEvents`;
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const events = data?.quoteSummary?.result?.[0]?.calendarEvents;
    if (!events) return null;
    const earningsDates = events.earnings?.earningsDate || [];
    if (earningsDates.length === 0) return null;
    const dates = earningsDates.map(e => e.raw * 1000).filter(t => t > Date.now() - 86400000);
    if (dates.length === 0) return null;
    return {
      symbol: sym,
      nextEarnings: dates[0],
      nextEarningsStr: new Date(dates[0]).toISOString().slice(0, 10)
    };
  } catch (e) { return null; }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get('s') || '').split(',').filter(Boolean).slice(0, 20);
  if (raw.length === 0) {
    return new Response(JSON.stringify({ events: [] }), {
      status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
  const results = await Promise.all(raw.map(fetchEarnings));
  const events = results.filter(Boolean);
  return new Response(JSON.stringify({ events }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=43200, stale-while-revalidate=86400',
      'access-control-allow-origin': '*'
    }
  });
}
