// Mock driver — walks through the same steps a real portal driver performs
// (login → navigate → prefill → save draft → screenshot) without opening a
// browser. Used whenever BIRDIE_MOCK is not 'false', so the whole worker loop
// can be run and demoed without portal accounts.

import type { Job, PortalCredentials, FillResult, PortalDriver } from '../types.js';

const STEPS = ['login', 'open new application', 'prefill system data', 'prefill inverter + storage', 'save as draft', 'screenshot'];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function createMockDriver(netzbetreiber: string): PortalDriver {
  return {
    netzbetreiber,
    async fillDraft(job: Job, _creds: PortalCredentials): Promise<FillResult> {
      for (const step of STEPS) {
        await sleep(120);
        console.log(`[netzbot]     · ${step}`);
      }
      // Deterministic failure case so the error/backoff path is visible too.
      if (!job.fields.kwp) {
        return { ok: false, error: 'TimeoutError: required field "Anlagenleistung" missing — cannot prefill' };
      }
      return { ok: true, draftRef: `MOCK-${job.offerId.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}` };
    },
  };
}
