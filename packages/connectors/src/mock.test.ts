import { describe, expect, it } from 'vitest';
import { createMockFetch } from './mock/fetch.js';
import { createTransport, isMockMode } from './context.js';

describe('createMockFetch', () => {
  const mockFetch = createMockFetch({ latencyMs: 0 });

  it('answers a known route with JSON and status 200', async () => {
    const res = await mockFetch('https://api.awattar.de/v1/marketdata');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    const json = (await res.json()) as { object: string; data: unknown[] };
    expect(json.object).toBe('list');
    expect(json.data).toHaveLength(24);
  });

  it('accepts URL and Request inputs as well as strings', async () => {
    const byUrl = await mockFetch(new URL('https://my.sevdesk.de/api/v1/Invoice?limit=1'));
    expect(byUrl.status).toBe(200);
    const byRequest = await mockFetch(new Request('https://gmail.googleapis.com/gmail/v1/users/me/profile'));
    expect(byRequest.status).toBe(200);
  });

  it('returns 404 for an unknown host', async () => {
    const res = await mockFetch('https://unknown.example.com/anything');
    expect(res.status).toBe(404);
    expect(res.ok).toBe(false);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain('no mock route');
  });
});

describe('createTransport', () => {
  it('uses the mock transport in default (mock) mode', async () => {
    expect(isMockMode()).toBe(true);
    const transport = createTransport();
    // The mock transport answers offline; a real transport would hit the network.
    const res = await transport('https://unknown.example.com/anything');
    expect(res.status).toBe(404);
    expect(((await res.json()) as { error: string }).error).toContain('no mock route');
  });
});
