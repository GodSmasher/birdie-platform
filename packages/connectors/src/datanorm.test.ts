import { describe, expect, it } from 'vitest';
import {
  articleToComponent,
  articlesToComponents,
  componentsToDatanorm,
  parseDatanorm,
  type ReonicComponentPayload,
} from './datanorm.js';

const payloads: ReonicComponentPayload[] = [
  { componentType: 'module', name: 'PV module 440 Wp', description: 'glass-glass', articleNumber: 'ES-440-GG', salesPrice: 129, quantityUnit: 'Stck' },
  { componentType: 'inverter', name: 'Hybrid inverter 10 kW', articleNumber: 'EI-H10', salesPrice: 2190.5, quantityUnit: 'Stck' },
  // Purchase price only -> Preiskennzeichen 2 (net price).
  { componentType: 'accessory', name: 'DC cable', articleNumber: 'CAB-6', purchasePrice: 1.99, quantityUnit: 'm' },
];

describe('componentsToDatanorm', () => {
  it('writes a header line followed by one "A" record per component', () => {
    const text = componentsToDatanorm(payloads);
    const lines = text.split('\r\n');
    expect(lines[0]).toMatch(/^V;\d{2}\.\d{2}\.\d{4};\.birdie Export;EUR;4;$/);
    expect(lines.slice(1, 4).every((l) => l.startsWith('A;N;'))).toBe(true);
    expect(lines[lines.length - 1]).toBe('');
    // Prices are written in cents, the price marker reflects sales vs. purchase.
    expect(lines[1].split(';')).toEqual(['A', 'N', 'ES-440-GG', '00', 'PV module 440 Wp', 'glass-glass', '1', '1', 'Stck', '12900', '', '', '']);
    expect(lines[3].split(';')[6]).toBe('2');
    expect(lines[3].split(';')[9]).toBe('199');
  });

  it('supports the update action', () => {
    const text = componentsToDatanorm(payloads.slice(0, 1), 'A');
    expect(text.split('\r\n')[1].startsWith('A;A;ES-440-GG;')).toBe(true);
  });
});

describe('parseDatanorm round trip', () => {
  it('yields the same article numbers and prices', () => {
    const articles = parseDatanorm(componentsToDatanorm(payloads));
    expect(articles).toHaveLength(payloads.length);
    expect(articles.map((a) => a.articleNumber)).toEqual(payloads.map((p) => p.articleNumber));
    expect(articles.map((a) => a.priceEur)).toEqual(payloads.map((p) => p.salesPrice ?? p.purchasePrice));
    expect(articles.map((a) => a.name)).toEqual(payloads.map((p) => p.name));
    expect(articles.every((a) => a.action === 'new')).toBe(true);
    expect(articles[0].description).toBe('glass-glass');
    expect(articles[1].description).toBeUndefined();
    expect(articles[2].unit).toBe('m');
    expect(articles[2].priceMarker).toBe('2');
  });

  it('maps the parsed articles back onto the original price fields', () => {
    const roundTripped = articlesToComponents(parseDatanorm(componentsToDatanorm(payloads)));
    expect(roundTripped.map((c) => c.salesPrice)).toEqual([129, 2190.5, undefined]);
    expect(roundTripped.map((c) => c.purchasePrice)).toEqual([undefined, undefined, 1.99]);
    expect(roundTripped.map((c) => c.articleNumber)).toEqual(['ES-440-GG', 'EI-H10', 'CAB-6']);
  });
});

describe('parseDatanorm', () => {
  it('skips blank and non-article records and honours the price unit', () => {
    const text = [
      'V;01.01.2026;Wholesaler;EUR;4;',
      '',
      'B;some other record',
      'A;N;ART-1;00;Cable;;1;100;m;1250;RG1;',
      'A;L;ART-2;00;Deleted;;1;1;Stck;100;;',
      'A;N;;00;no article number;;1;1;Stck;100;;',
    ].join('\n');
    const articles = parseDatanorm(text);
    expect(articles).toHaveLength(2);
    expect(articles[0]).toMatchObject({ articleNumber: 'ART-1', priceEur: 0.13, priceUnit: 100, unit: 'm', discountGroup: 'RG1', action: 'new' });
    expect(articles[1].action).toBe('delete');
    // Deleted articles are dropped when mapping to Reonic components.
    expect(articlesToComponents(articles)).toHaveLength(1);
  });

  it('articleToComponent respects explicit overrides', () => {
    const [article] = parseDatanorm('A;N;X-1;00;Thing;;1;1;1;500;;');
    const c = articleToComponent(article, { componentType: 'wallbox', brand: 'Acme', vatRate: 0.07, priceAs: 'purchase' });
    expect(c).toMatchObject({ componentType: 'wallbox', brand: 'Acme', vatRate: 0.07, purchasePrice: 5, quantityUnit: 'Stck' });
    expect(c.salesPrice).toBeUndefined();
  });
});
