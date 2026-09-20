import { cookies } from 'next/headers';

/**
 * Mock mode is the default: the app serves static fake data and never
 * touches Supabase or any external API. Set BIRDIE_MOCK=false (plus the
 * credentials in .env.example) to run against real services.
 */
export function isMockMode(): boolean {
  return process.env.BIRDIE_MOCK !== 'false';
}

export function isDemoMode(): boolean {
  if (isMockMode()) return true;
  if (process.env.DEFAULT_TENANT_SLUG === 'demo') return true;
  try {
    const store = cookies();
    return store.get('birdie_demo')?.value === '1';
  } catch {
    return false;
  }
}
