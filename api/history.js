export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default async function handler(req) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get('s') || '').trim();
  const range = (url.searchParams.get('range') || '1y').trim();
  const interval = (url.searchParams.get('interval') || '1d').trim();
  if (!symbol) {
    return new Response(JSON.stringify({ error: 'no symbol' }), {
      status: 400, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
  try {
    const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
    const r = await fetch(yfUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) throw new Error('http ' + r.status);
    const data = await r.json();
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('no data');
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    const series = timestamps.map((ts, i) => ({ t: ts * 1000, c: closes[i] })).filter(x => x.c != null);
    return new Response(JSON.stringify({
      symbol: result.meta?.symbol || symbol,
      currency: result.meta?.currency || '',
      series
    }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=600, stale-while-revalidate=3600',
        'access-control-allow-origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
}
