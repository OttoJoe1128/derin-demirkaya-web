'use client';

import SpatialLayoutShell from './SpatialLayoutShell';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

interface AppLayoutShellProps {
  children: React.ReactNode;
  lang?: Locale;
  dict?: Dictionary;
}

export default function AppLayoutShell({ children, lang = 'tr', dict }: AppLayoutShellProps) {
  return (
    <SpatialLayoutShell lang={lang} dict={dict}>
      {children}
    </SpatialLayoutShell>
  );
}
