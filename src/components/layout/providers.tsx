'use client';

import React from 'react';
import { ActiveThemeProvider } from '../themes/active-theme';
import QueryProvider from './query-provider';
import { DebufaStoreProvider } from '@/lib/debufa-store';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <QueryProvider>
        <DebufaStoreProvider>{children}</DebufaStoreProvider>
      </QueryProvider>
    </ActiveThemeProvider>
  );
}
