// Kommunikation mit der .birdie-App: holt die zu bearbeitenden Anmeldungen und
// meldet erzeugte Entwürfe / Fehler zurück. Nutzt ein Bearer-Service-Token.
//
// INTEGRATIONS-VERTRAG (in der App umgesetzt: app/api/netzanmeldung/bot):
//   GET  {api}/api/netzanmeldung/bot   → Job[]  (datenvollständig, noch ohne Entwurf)
//   POST {api}/api/netzanmeldung/bot   { offerId, recordDraft, draftRef }  → Entwurf
//   POST {api}/api/netzanmeldung/bot   { offerId, error: {step,error} }   → Fehler
// Beide mit  Authorization: Bearer <BIRDIE_BOT_TOKEN>.

import { config, isMockMode } from './config.js';
import type { Job } from './types.js';

const ENDPOINT = '/api/netzanmeldung/bot';

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${config.birdieToken}`, 'Content-Type': 'application/json' };
}

export interface JobWithCreds extends Job {
  credentials?: { username: string; password: string; portalUrl: string };
}

// Sample queue for mock mode — fake customers, one job incomplete on purpose
// so the error path shows up in the run.
const MOCK_JOBS: JobWithCreds[] = [
  { offerId: 'a1b2c3d4-0001', customer: 'Familie Beispiel', netzbetreiber: 'SW Suhl',
    fields: { name: 'Erika Beispiel', street: 'Musterstraße 1', zip: '98527', city: 'Suhl', kwp: 9.8, moduleCount: 22, moduleType: 'ExampleSolar 440', inverter: 'ExampleInverter H10', inverterKw: 10, inverterCount: 1, battery: 'ExampleStorage 10', batteryKwh: 10, phases: 3, einspeiseart: 'ueberschuss', speicherkopplung: 'dc', naSchutz: true } },
  { offerId: 'a1b2c3d4-0002', customer: 'Hof Sonnenfeld', netzbetreiber: 'TEN Thüringer Energienetze',
    fields: { name: 'Max Mustermann', street: 'Beispielweg 7', zip: '99084', city: 'Erfurt', kwp: 24.6, moduleCount: 56, inverter: 'ExampleInverter T25', inverterKw: 25, inverterCount: 1, phases: 3, einspeiseart: 'ueberschuss' } },
  { offerId: 'a1b2c3d4-0003', customer: 'Praxis Dr. Muster', netzbetreiber: 'SW Bayreuth',
    fields: { name: 'Dr. Anna Muster', street: 'Probeallee 3', zip: '95444', city: 'Bayreuth' } },
];

export async function fetchJobs(): Promise<JobWithCreds[]> {
  if (isMockMode()) return MOCK_JOBS;
  if (!config.birdieApiUrl) return [];
  try {
    const res = await fetch(`${config.birdieApiUrl}${ENDPOINT}`, { headers: authHeaders() });
    if (!res.ok) return [];
    return (await res.json()) as JobWithCreds[];
  } catch {
    return [];
  }
}

export async function reportDraft(offerId: string, draftRef?: string): Promise<void> {
  if (isMockMode()) return void console.log(`[netzbot]   → (mock) birdie notified: draft ${draftRef} for ${offerId}`);
  if (!config.birdieApiUrl) return;
  try {
    await fetch(`${config.birdieApiUrl}${ENDPOINT}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ offerId, recordDraft: 'e2', draftRef }),
    });
  } catch { /* retry next tick */ }
}

export async function reportError(
  offerId: string,
  err: { step: string; error: string; screenshot?: string },
): Promise<void> {
  if (isMockMode()) return void console.log(`[netzbot]   → (mock) birdie notified: error at step "${err.step}" for ${offerId}`);
  if (!config.birdieApiUrl) return;
  try {
    await fetch(`${config.birdieApiUrl}${ENDPOINT}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ offerId, error: err }),
    });
  } catch { /* retry next tick */ }
}
