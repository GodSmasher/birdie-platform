// Driver registry: utility name → portal driver. Add new portals here.
//
// This public repository ships a representative subset of drivers (one shared
// portal family plus one standalone portal). See README.md for the full list
// of portals covered by the private implementation.

import type { PortalDriver } from '../types.js';
import { isMockMode } from '../config.js';
import { createMockDriver } from './mock-portal.js';

// Lovion portal family (shared implementation in _lovion.ts)
import { swSuhlDriver } from './sw-suhl.js';
import { swBayreuthDriver } from './sw-bayreuth.js';

// Standalone portal
import { tenDriver } from './ten.js';

const drivers: PortalDriver[] = [swSuhlDriver, swBayreuthDriver, tenDriver];

export function driverFor(netzbetreiber: string): PortalDriver | null {
  if (isMockMode()) return createMockDriver(netzbetreiber);
  return drivers.find((d) => d.netzbetreiber === netzbetreiber) ?? null;
}

export function supportedNetzbetreiber(): string[] {
  return drivers.map((d) => d.netzbetreiber);
}
