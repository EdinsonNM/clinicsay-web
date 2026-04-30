import type { ReactNode } from 'react';
import { QueryClientAppProvider } from './query-client.provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientAppProvider>{children}</QueryClientAppProvider>;
}
