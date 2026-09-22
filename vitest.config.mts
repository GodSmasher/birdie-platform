import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Root test runner for all workspaces (apps/web, packages/connectors,
// automations/portal-bot). Every test runs against the mock transport, so
// nothing here touches the network.
const webRoot = fileURLToPath(new URL('./apps/web', import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror the `@/*` path alias from apps/web/tsconfig.json.
    alias: [{ find: /^@\/(.*)$/, replacement: `${webRoot}/$1` }],
  },
  test: {
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
});
