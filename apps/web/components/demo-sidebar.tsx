'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BirdieLogo } from './ui';
import { useLocale, useT } from '@/app/demo/i18n/client';

type NavKey = 'dashboard' | 'interconnection' | 'sales' | 'fleet' | 'bots' | 'workflows' | 'connectors';

const mainItems = [
  { label: 'Dashboard', icon: '◇', href: '/demo/dashboard', key: 'dashboard' as NavKey },
  { label: 'Interconnection', icon: '⚡', href: '/demo/interconnection', key: 'interconnection' as NavKey },
  { label: 'Sales', icon: '↗', href: '/demo/sales', key: 'sales' as NavKey },
  { label: 'Fleet', icon: '☀', href: '/demo/fleet', key: 'fleet' as NavKey },
];

const autoItems = [
  { label: 'Bots', icon: '◈', href: '/demo/bots', key: 'bots' as NavKey },
  { label: 'Workflows', icon: '→', href: '/demo/workflows', key: 'workflows' as NavKey },
  { label: 'Connectors', icon: '⌘', href: '/demo/connectors', key: 'connectors' as NavKey },
];

function NavItem({ label, icon, href, active }: { label: string; icon: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 h-9 px-2.5 rounded-lg transition-colors ${
        active ? 'bg-surface-2 text-fg font-medium' : 'text-fg2 hover:text-fg hover:bg-surface'
      }`}
    >
      <span className={`text-sm w-5 text-center ${active ? 'text-accent' : 'text-fg3'}`}>{icon}</span>
      <span className="text-[13px]">{label}</span>
    </Link>
  );
}

export function DemoSidebar({ active }: { active: NavKey }) {
  const t = useT();
  const locale = useLocale();
  const pathname = usePathname();
  const resolvedActive = pathname.includes('/interconnection') ? 'interconnection'
    : pathname.includes('/sales') ? 'sales'
    : pathname.includes('/fleet') ? 'fleet'
    : pathname.includes('/bots') ? 'bots'
    : pathname.includes('/workflows') ? 'workflows'
    : pathname.includes('/connectors') ? 'connectors'
    : active;

  return (
    <>
      <button className="lg:hidden fixed top-3 left-3 z-30 w-10 h-10 rounded-lg bg-surface border border-line flex items-center justify-center text-fg2" aria-label={t('Menu')}>
        ☰
      </button>
      <aside className="hidden lg:flex w-[220px] shrink-0 border-r border-line bg-bg flex-col py-5 px-3 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 px-2.5 mb-6">
          <BirdieLogo variant="dark" className="h-7 dark:hidden" />
          <BirdieLogo variant="light" className="h-7 hidden dark:block" />
        </div>
        <div className="mb-5">
          <p className="text-[9px] font-semibold text-fg4 tracking-[0.18em] uppercase mb-1.5 px-2.5">{t('MAIN')}</p>
          <nav className="flex flex-col gap-0.5">
            {mainItems.map(it => (
              <NavItem key={it.key} label={t(it.label)} icon={it.icon} href={it.href} active={it.key === resolvedActive} />
            ))}
          </nav>
        </div>
        <div className="mb-5">
          <p className="text-[9px] font-semibold text-fg4 tracking-[0.18em] uppercase mb-1.5 px-2.5">{t('AUTOMATION')}</p>
          <nav className="flex flex-col gap-0.5">
            {autoItems.map(it => (
              <NavItem key={it.key} label={t(it.label)} icon={it.icon} href={it.href} active={it.key === resolvedActive} />
            ))}
          </nav>
        </div>
        <div className="mt-auto px-2.5">
          {/* Language switch — plain links so it works without client state */}
          <div className="flex items-center gap-1 mb-2" aria-label={t('Language')}>
            {(['en', 'de'] as const).map((l) => (
              <a
                key={l}
                href={`/demo/lang?to=${l}&next=${encodeURIComponent(pathname)}`}
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                  locale === l ? 'bg-surface-2 text-fg' : 'text-fg3 hover:text-fg hover:bg-surface'
                }`}
              >
                {l}
              </a>
            ))}
          </div>
          <div className="rounded-xl bg-accent-bg p-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-accent tracking-wider">{t('DEMO MODE')}</span>
            <span className="text-[10px] text-fg2 leading-tight">{t('Live preview with Nashville / NES data')}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
