import type { ReactNode } from 'react';
import { QueryClientAppProvider } from './query-client.provider';
import { SessionProvider } from './session.provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientAppProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientAppProvider>
  );
}
