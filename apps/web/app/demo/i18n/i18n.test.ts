import { describe, expect, it } from 'vitest';
import { LOCALES, LOCALE_COOKIE, normalizeLocale, translate } from '@/app/demo/i18n';
import { de } from '@/app/demo/i18n/de';
import { shell } from '@/app/demo/i18n/de/shell';
import { demoSidebar } from '@/app/demo/i18n/de/demoSidebar';
import { dashboard } from '@/app/demo/i18n/de/dashboard';
import { leads } from '@/app/demo/i18n/de/leads';
import { pipeline } from '@/app/demo/i18n/de/pipeline';
import { projects } from '@/app/demo/i18n/de/projects';
import { interconnection } from '@/app/demo/i18n/de/interconnection';
import { schedule } from '@/app/demo/i18n/de/schedule';
import { inbox } from '@/app/demo/i18n/de/inbox';
import { reports } from '@/app/demo/i18n/de/reports';
import { automations } from '@/app/demo/i18n/de/automations';
import { integrations } from '@/app/demo/i18n/de/integrations';
import { settings } from '@/app/demo/i18n/de/settings';
import { workflows } from '@/app/demo/i18n/de/workflows';
import { bots } from '@/app/demo/i18n/de/bots';
import { connectors } from '@/app/demo/i18n/de/connectors';
import { fleet } from '@/app/demo/i18n/de/fleet';
import { sales } from '@/app/demo/i18n/de/sales';

// One entry per file in app/demo/i18n/de (mirrors the spread order in de/index.ts).
const dictionaryFiles: Record<string, Record<string, string>> = {
  shell, demoSidebar, dashboard, leads, pipeline, projects, interconnection, schedule, inbox,
  reports, automations, integrations, settings, workflows, bots, connectors, fleet, sales,
};

describe('translate', () => {
  it('returns the English source string for the en locale', () => {
    expect(translate('en', 'Dashboard')).toBe('Dashboard');
    expect(translate('en', 'Settings')).toBe('Settings');
  });

  it('looks up German translations by English source string', () => {
    expect(translate('de', 'Dashboard')).toBe('Dashboard');
    expect(translate('de', 'Settings')).toBe('Einstellungen');
    expect(translate('de', 'Overview')).toBe('Übersicht');
    expect(translate('de', 'Interconnection')).toBe('Netzanmeldung');
  });

  it('falls back to English for unknown keys', () => {
    const unknown = 'This string has no German translation';
    expect(de[unknown]).toBeUndefined();
    expect(translate('de', unknown)).toBe(unknown);
  });
});

describe('normalizeLocale', () => {
  it('maps "de" to de and everything else to en', () => {
    expect(normalizeLocale('de')).toBe('de');
    for (const value of ['en', 'DE', 'de-DE', 'fr', '', undefined, null]) {
      expect(normalizeLocale(value)).toBe('en');
    }
  });

  it('exposes the supported locales and the cookie name', () => {
    expect(LOCALES).toEqual(['en', 'de']);
    expect(LOCALE_COOKIE).toBe('birdie_lang');
  });
});

describe('German dictionaries', () => {
  it('contain only non-empty string values', () => {
    for (const [file, dict] of Object.entries(dictionaryFiles)) {
      expect(Object.keys(dict).length, `${file} is empty`).toBeGreaterThan(0);
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value, `${file}: ${JSON.stringify(key)}`).toBe('string');
        expect(value.trim(), `${file}: ${JSON.stringify(key)} is empty`).not.toBe('');
      }
    }
  });

  it('merge every per-page file into the de dictionary', () => {
    const merged = new Set(Object.values(dictionaryFiles).flatMap((d) => Object.keys(d)));
    expect(Object.keys(de).length).toBe(merged.size);
    for (const key of merged) expect(de).toHaveProperty([key]);
  });

  it('have no duplicate keys with conflicting translations across files', () => {
    // Shared terms may repeat across files but must carry the same translation
    // everywhere, otherwise the last spread in de/index.ts silently wins.
    const byKey = new Map<string, { file: string; value: string }[]>();
    for (const [file, dict] of Object.entries(dictionaryFiles)) {
      for (const [key, value] of Object.entries(dict)) {
        const entries = byKey.get(key) ?? [];
        entries.push({ file, value });
        byKey.set(key, entries);
      }
    }
    const conflicts = [...byKey.entries()]
      .filter(([, entries]) => new Set(entries.map((e) => e.value)).size > 1)
      .map(([key, entries]) => `${JSON.stringify(key)}: ${entries.map((e) => `${e.file}=${JSON.stringify(e.value)}`).join(' | ')}`);
    expect(conflicts).toEqual([]);
  });
});
