import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../core/navigation/app-routes';
import type { AdminSession } from '../../domains/auth/models/admin-session.model';
import { QueryClientAppProvider } from '../providers/query-client.provider';
import { SessionProvider } from '../providers/session.provider';
import { AppRouter } from './app-router';

const adminSessionFixture: AdminSession = {
  token: 'test-token',
  user: { id: 'u1', role: 'admin', name: 'Admin' },
};

function TestProviders({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: AdminSession;
}) {
  return (
    <QueryClientAppProvider>
      <SessionProvider initialSession={initialSession}>{children}</SessionProvider>
    </QueryClientAppProvider>
  );
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
          <TestProviders initialSession={adminSessionFixture}>
            <AppRouter />
          </TestProviders>
        </MemoryRouter>,
      );

      expect(
        await screen.findByRole('heading', { name: /ClinicSay/i }, { timeout: 15_000 }),
      ).toBeInTheDocument();
    },
    20_000,
  );

  it(
    'sin sesión, /agenda redirige al login',
    async () => {
      render(
        <MemoryRouter initialEntries={[APP_ROUTES.agenda]}>
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
    'con sesión muestra el directorio en /doctors',
    async () => {
      render(
        <MemoryRouter initialEntries={[APP_ROUTES.doctors]}>
          <TestProviders initialSession={adminSessionFixture}>
            <AppRouter />
          </TestProviders>
        </MemoryRouter>,
      );
      expect(
        await screen.findByRole('heading', { name: /Equipo médico/i }, { timeout: 15_000 }),
      ).toBeInTheDocument();
    },
    20_000,
  );
});
