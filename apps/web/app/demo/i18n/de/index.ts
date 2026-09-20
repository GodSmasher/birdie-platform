import { shell } from './shell';
import { demoSidebar } from './demoSidebar';
import { dashboard } from './dashboard';
import { leads } from './leads';
import { pipeline } from './pipeline';
import { projects } from './projects';
import { interconnection } from './interconnection';
import { schedule } from './schedule';
import { inbox } from './inbox';
import { reports } from './reports';
import { automations } from './automations';
import { integrations } from './integrations';
import { settings } from './settings';
import { workflows } from './workflows';
import { bots } from './bots';
import { connectors } from './connectors';
import { fleet } from './fleet';
import { sales } from './sales';

/**
 * German dictionary — one file per demo page, merged here. Keys are the English
 * source strings; shared terms must carry the same translation in every file
 * (later spreads win).
 */
export const de: Record<string, string> = {
  ...shell,
  ...demoSidebar,
  ...dashboard,
  ...leads,
  ...pipeline,
  ...projects,
  ...interconnection,
  ...schedule,
  ...inbox,
  ...reports,
  ...automations,
  ...integrations,
  ...settings,
  ...workflows,
  ...bots,
  ...connectors,
  ...fleet,
  ...sales,
};
