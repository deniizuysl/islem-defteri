export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SECTOR_TR = {
  'Technology': 'Teknoloji',
  'Communication Services': 'İletişim',
  'Consumer Cyclical': 'Tüketim (Döngüsel)',
  'Consumer Defensive': 'Tüketim (Savunma)',
  'Financial Services': 'Finans',
  'Financial': 'Finans',
  'Healthcare': 'Sağlık',
  'Industrials': 'Sanayi',
  'Basic Materials': 'Hammadde',
  'Energy': 'Enerji',
  'Utilities': 'Enerji/Su',
  'Real Estate': 'Gayrimenkul',
  'Conglomerates': 'Holding'
};

export default async function handler(req) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();
  if (q.length < 1) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }

  try {
    const yfUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&enableFuzzyQuery=false`;
    const r = await fetch(yfUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://finance.yahoo.com/' }
    });
    if (!r.ok) throw new Error('http ' + r.status);
    const data = await r.json();
    const results = (data.quotes || [])
      .filter(x => x.quoteType === 'EQUITY' && x.symbol)
      .map(x => ({
        symbol: x.symbol,
        name: x.shortname || x.longname || x.symbol,
        exchange: x.exchDisp || x.exchange || '',
        market: x.symbol.endsWith('.IS') ? 'BIST' : (x.exchange === 'NMS' || x.exchange === 'NGM' ? 'NASDAQ' : 'NYSE'),
        sector: x.sector || '',
        sectorTR: SECTOR_TR[x.sector] || x.sector || '',
        industry: x.industry || '',
        typeDisp: x.typeDisp || ''
      }))
      .slice(0, 8);
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=3600, stale-while-revalidate=86400',
        'access-control-allow-origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), results: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
}
