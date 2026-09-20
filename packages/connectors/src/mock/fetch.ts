// Mock transport — answers every connector request with deterministic fake
// data, shaped exactly like the real API response. It is injected as
// `ctx.fetch`, so connectors run their real parsing/normalization code and
// never know the difference. No network, no accounts, no keys.

type Handler = (url: URL, init?: RequestInit) => unknown;

const HOUR = 3_600_000;

function hourStart(offsetHours = 0): number {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.getTime() + offsetHours * HOUR;
}

/** Smooth day curve: cheap at noon (solar surplus), expensive in the evening. */
function priceAt(ts: number): number {
  const h = new Date(ts).getHours();
  return Math.round((85 + 45 * Math.cos(((h - 19) / 24) * 2 * Math.PI)) * 100) / 100;
}

/** Bell-shaped PV output between 06:00 and 20:00, in kW for a 9.8 kWp roof. */
function pvAt(ts: number): number {
  const d = new Date(ts);
  const h = d.getHours() + d.getMinutes() / 60;
  if (h < 6 || h > 20) return 0;
  return Math.round(7.4 * Math.sin(((h - 6) / 14) * Math.PI) ** 2 * 1000) / 1000;
}

function iso(ts: number): string {
  return new Date(ts).toISOString();
}

const routes: [RegExp, Handler][] = [
  // aWATTar — day-ahead market prices (EUR/MWh)
  [/^api\.awattar\.(de|at)\/v1\/marketdata/, () => ({
    object: 'list',
    data: Array.from({ length: 24 }, (_, i) => {
      const start = hourStart(i);
      return { start_timestamp: start, end_timestamp: start + HOUR, marketprice: priceAt(start), unit: 'Eur/MWh' };
    }),
  })],

  // Tibber — GraphQL
  [/^api\.tibber\.com\/v1-beta\/gql/, () => {
    const nowHour = new Date().getHours();
    const price = (i: number) => ({
      total: Math.round((priceAt(hourStart(i)) / 1000 + 0.19) * 10000) / 10000,
      startsAt: iso(hourStart(i)),
    });
    return {
      data: {
        viewer: {
          homes: [{
            currentSubscription: {
              priceInfo: {
                current: price(0),
                today: Array.from({ length: 24 }, (_, i) => price(i - nowHour)),
                tomorrow: Array.from({ length: 24 }, (_, i) => price(i + 24 - nowHour)),
              },
            },
          }],
        },
      },
    };
  }],

  // Solcast — rooftop PV forecast (30 min resolution)
  [/^api\.solcast\.com\.au\/rooftop_sites\//, () => ({
    forecasts: Array.from({ length: 48 }, (_, i) => {
      const end = hourStart(0) + (i + 1) * (HOUR / 2);
      return { pv_estimate: pvAt(end), period_end: iso(end), period: 'PT30M' };
    }),
  })],

  // OpenWeatherMap — 5 day / 3 hour forecast
  [/^api\.openweathermap\.org\/data\/2\.5\/forecast/, () => ({
    cod: '200',
    list: Array.from({ length: 40 }, (_, i) => {
      const ts = hourStart(i * 3);
      const h = new Date(ts).getHours();
      return {
        dt: Math.floor(ts / 1000),
        main: { temp: Math.round((11 + 8 * Math.sin(((h - 8) / 24) * 2 * Math.PI)) * 10) / 10 },
        clouds: { all: (i * 37) % 100 },
      };
    }),
  })],

  // EcoFlow — IoT developer API
  [/^api(-e)?\.ecoflow\.com\/iot-open\/sign\/device\/list/, () => ({
    code: '0',
    message: 'Success',
    data: [
      { sn: 'MOCK-DELTA-0001', online: 1, deviceName: 'Garage storage', productName: 'DELTA Pro' },
      { sn: 'MOCK-PSTREAM-0002', online: 0, deviceName: 'Balcony', productName: 'PowerStream' },
    ],
  })],
  [/^api(-e)?\.ecoflow\.com\/iot-open\/sign\/device\/quota\/all/, () => ({
    code: '0',
    message: 'Success',
    data: { 'bmsMaster.soc': 78, 'mppt.inWatts': 1840, 'inv.acOutWatts': 620, 'pd.dcOutWatts': 45, 'inv.gridWatts': -310 },
  })],

  // sevDesk — accounting
  [/^my\.sevdesk\.de\/api\/v1\/CheckAccount/, () => ({ objects: [{ id: '1', name: 'Business account (mock)' }] })],
  [/^my\.sevdesk\.de\/api\/v1\/Invoice/, () => {
    const day = (n: number) => iso(Date.now() - n * 24 * HOUR);
    const contact = (id: string, name: string) => ({ id, name });
    return {
      objects: [
        { id: '9001', invoiceNumber: 'RE-2026-0141', status: '200', sumGross: '18450.00', sumNet: '15504.20', invoiceDate: day(34), timeToPay: '14', payDate: null, contact: contact('c1', 'Familie Beispiel') },
        { id: '9002', invoiceNumber: 'RE-2026-0142', status: '200', sumGross: '9120.50', sumNet: '7664.29', invoiceDate: day(6), timeToPay: '14', payDate: null, contact: contact('c2', 'Mustermann GbR') },
        { id: '9003', invoiceNumber: 'RE-2026-0139', status: '1000', sumGross: '24980.00', sumNet: '20991.60', invoiceDate: day(48), timeToPay: '14', payDate: day(30), contact: contact('c3', 'Hof Sonnenfeld') },
        { id: '9004', invoiceNumber: 'RE-2026-0143', status: '100', sumGross: '3200.00', sumNet: '2689.08', invoiceDate: day(1), timeToPay: '14', payDate: null, contact: contact('c4', 'Praxis Dr. Muster') },
      ],
    };
  }],

  // Reonic — CRM component catalog
  [/^api\.reonic\.(de|info)\/rest\/v2\/clients\/[^/]+\/components/, () => [
    { id: 'cmp-001', name: 'PV-Modul 440 Wp Glas-Glas', brand: 'ExampleSolar', articleNr: 'ES-440-GG', price: '129.00', purchasePrice: '96.50', vat: '0' },
    { id: 'cmp-002', name: 'Hybrid-Wechselrichter 10 kW', brand: 'ExampleInverter', articleNr: 'EI-H10', price: '2190.00', purchasePrice: '1645.00', vat: '0' },
    { id: 'cmp-003', name: 'Batteriespeicher 10 kWh', brand: 'ExampleStorage', articleNr: 'EST-10', price: '4890.00', purchasePrice: '3720.00', vat: '0' },
    { id: 'cmp-004', name: 'Wallbox 11 kW', brand: 'ExampleCharge', articleNr: 'EC-11', price: '749.00', purchasePrice: '540.00', vat: '19' },
  ]],

  // Google — OAuth, Gmail, Calendar, Drive
  [/^oauth2\.googleapis\.com\/token/, () => ({ access_token: 'mock-access-token', expires_in: 3600, token_type: 'Bearer' })],
  [/^gmail\.googleapis\.com\/gmail\/v1\/users\/me\/profile/, () => ({
    emailAddress: 'office@sunpeak-solar.example',
    messagesTotal: 4812,
    threadsTotal: 2210,
  })],
  [/^gmail\.googleapis\.com\/gmail\/v1\/users\/me\/messages\/[^/?]+/, (url) => {
    const id = url.pathname.split('/').pop() ?? '';
    const inbox: Record<string, [string, string]> = {
      m1: ['Netzbetreiber Beispielnetz <netzanschluss@utility.example>', 'Ihre Anmeldung 2026-04417: Unterlagen vollständig'],
      m2: ['Großhandel Muster <order@wholesale.example>', 'Lieferavis: 24x PV-Modul 440 Wp'],
      m3: ['Familie Beispiel <kunde@example.com>', 'Rückfrage zum Montagetermin'],
    };
    const [from, subject] = inbox[id] ?? ['noreply@example.com', 'Mock message'];
    return { id, snippet: subject, payload: { headers: [{ name: 'From', value: from }, { name: 'Subject', value: subject }] } };
  }],
  [/^gmail\.googleapis\.com\/gmail\/v1\/users\/me\/messages/, (url) =>
    url.searchParams.get('q') === 'is:unread'
      ? { resultSizeEstimate: 7 }
      : { messages: [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }], resultSizeEstimate: 3 }],
  [/^www\.googleapis\.com\/calendar\/v3\/calendars\/[^/]+\/events/, () => {
    const slot = (h: number, len = 2) => ({ start: { dateTime: iso(hourStart(h)) }, end: { dateTime: iso(hourStart(h + len)) } });
    return {
      items: [
        { id: 'ev1', summary: 'Montage — Familie Beispiel (9,8 kWp)', location: 'Musterstraße 1, 10115 Berlin', ...slot(20, 8), attendees: [{ email: 'crew-a@sunpeak-solar.example' }] },
        { id: 'ev2', summary: 'Vor-Ort-Termin — Hof Sonnenfeld', location: 'Beispielweg 7, 04109 Leipzig', ...slot(44), attendees: [] },
        { id: 'ev3', summary: 'Zählerwechsel mit Netzbetreiber', ...slot(70, 1) },
      ],
    };
  }],
  [/^www\.googleapis\.com\/drive\/v3\/about/, (url) =>
    url.searchParams.get('fields')?.includes('storageQuota')
      ? { storageQuota: { usage: '18253611008', limit: '107374182400' } }
      : { user: { emailAddress: 'office@sunpeak-solar.example' } }],
  [/^www\.googleapis\.com\/drive\/v3\/files/, () => ({
    files: [
      { id: 'f1', name: 'Netzanmeldung_Beispiel_2026-04417.pdf', mimeType: 'application/pdf', modifiedTime: iso(hourStart(-5)), size: '284113' },
      { id: 'f2', name: 'Inbetriebnahmeprotokoll_Sonnenfeld.pdf', mimeType: 'application/pdf', modifiedTime: iso(hourStart(-29)), size: '412008' },
      { id: 'f3', name: 'Dachfotos', mimeType: 'application/vnd.google-apps.folder', modifiedTime: iso(hourStart(-50)) },
    ],
  })],

  // WhatsApp Business Cloud API
  [/^graph\.facebook\.com\/v[\d.]+\/[^/]+\/message_templates/, () => ({
    data: [
      { name: 'appointment_reminder', status: 'APPROVED', language: 'de', category: 'UTILITY' },
      { name: 'grid_approval_update', status: 'APPROVED', language: 'de', category: 'UTILITY' },
    ],
  })],
  [/^graph\.facebook\.com\/v[\d.]+\/[^/?]+/, () => ({
    display_phone_number: '+49 30 0000000',
    verified_name: 'SunPeak Solar (mock)',
    quality_rating: 'GREEN',
  })],
];

function toUrl(input: Parameters<typeof fetch>[0]): URL {
  if (typeof input === 'string') return new URL(input);
  if (input instanceof URL) return input;
  return new URL((input as Request).url);
}

export function createMockFetch(opts: { latencyMs?: number } = {}): typeof fetch {
  const { latencyMs = 40 } = opts;
  const mock = async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]): Promise<Response> => {
    const url = toUrl(input);
    const key = url.host + url.pathname;
    if (latencyMs) await new Promise((r) => setTimeout(r, latencyMs));
    for (const [pattern, handler] of routes) {
      if (pattern.test(key)) {
        return new Response(JSON.stringify(handler(url, init)), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    return new Response(JSON.stringify({ error: `no mock route for ${key}` }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  };
  return mock as typeof fetch;
}
