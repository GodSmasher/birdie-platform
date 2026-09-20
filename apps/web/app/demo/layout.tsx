import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LocaleProvider } from './i18n/client';
import { getLocale } from './i18n/server';

export const metadata: Metadata = {
  title: {
    template: 'birdie — %s',
    default: 'birdie CRM',
  },
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale={getLocale()}>
      <div className="flex min-h-screen bg-bg text-fg">
        {children}
      </div>
    </LocaleProvider>
  );
}
