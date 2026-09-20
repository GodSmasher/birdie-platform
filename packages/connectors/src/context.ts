import { createResilientFetch, type RetryPolicy } from './http.js';
import { createMockFetch } from './mock/fetch.js';
import { mockConfig } from './mock/config.js';
import type { ConnectorContext } from './types.js';

/** Mock mode is the default. Set BIRDIE_MOCK=false to talk to the real APIs. */
export function isMockMode(): boolean {
  return process.env.BIRDIE_MOCK !== 'false';
}

/** Pick the transport for the current mode. */
export function createTransport(retry: RetryPolicy = {}): typeof fetch {
  return isMockMode() ? createMockFetch() : createResilientFetch(retry);
}

/** Build the context a connector runs with: mock transport + placeholder config, or the real thing. */
export function createContext(
  connectorId: string,
  config: Record<string, string> = {},
  opts: { retry?: RetryPolicy; logger?: (msg: string) => void; fetch?: typeof fetch } = {},
): ConnectorContext {
  return {
    config: isMockMode() ? { ...mockConfig[connectorId], ...config } : config,
    fetch: opts.fetch ?? createTransport(opts.retry),
    logger: opts.logger,
  };
}
