import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
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
  it('muestra la página de login cuando no hay sesión', () => {
    render(
      <TestProviders>
        <AppRouter />
      </TestProviders>,
    );
    expect(screen.getByRole('heading', { name: /Bienvenido de nuevo/i })).toBeInTheDocument();
  });

  it('con sesión muestra la agenda principal', async () => {
    render(
      <TestProviders>
        <SeedAdminSession>
          <AppRouter />
        </SeedAdminSession>
      </TestProviders>,
    );

    expect(await screen.findByRole('heading', { name: /ClinicSay/i })).toBeInTheDocument();
  });
});
