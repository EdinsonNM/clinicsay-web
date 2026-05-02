import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../core/navigation/app-routes';
import { QueryClientAppProvider } from '../providers/query-client.provider';
import { SessionProvider, useSession } from '../providers/session.provider';
import { AppRouter } from './app-router';

function TestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientAppProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientAppProvider>
  );
}

function SeedAdminSession({ children }: { children: ReactNode }) {
  const { setSession } = useSession();
  useEffect(() => {
    setSession({
      token: 'test-token',
      user: { id: 'u1', role: 'admin', name: 'Admin' },
    });
  }, [setSession]);
  return <>{children}</>;
}

describe('AppRouter', () => {
  it(
    'muestra la página de login cuando no hay sesión',
    async () => {
      render(
        <MemoryRouter initialEntries={[APP_ROUTES.login]}>
          <TestProviders>
            <AppRouter />
          </TestProviders>
        </MemoryRouter>,
      );
      expect(
        await screen.findByRole('heading', { name: /Bienvenido de nuevo/i }, { timeout: 15_000 }),
      ).toBeInTheDocument();
    },
    20_000,
  );

  it(
    'con sesión muestra la agenda principal',
    async () => {
      render(
        <MemoryRouter initialEntries={[APP_ROUTES.agenda]}>
          <TestProviders>
            <SeedAdminSession>
              <AppRouter />
            </SeedAdminSession>
          </TestProviders>
        </MemoryRouter>,
      );

      expect(
        await screen.findByRole('heading', { name: /ClinicSay/i }, { timeout: 15_000 }),
      ).toBeInTheDocument();
    },
    20_000,
  );
});
