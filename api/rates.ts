const CNB_URL =
  'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'

export async function GET(): Promise<Response> {
  try {
    const res = await fetch(CNB_URL, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) {
      console.error(`CNB proxy: upstream returned ${res.status}`)
      return new Response(`CNB returned ${res.status}`, { status: 502 })
    }
    const text = await res.text()
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control':
          'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (e) {
    console.error('CNB proxy: fetch failed', e)
    return new Response('Failed to fetch from CNB', { status: 502 })
  }
}
