import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { QueryClientAppProvider } from '../providers/query-client.provider';
import { SessionProvider } from '../providers/session.provider';
import { AppRouter } from './app-router';

function TestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientAppProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientAppProvider>
  );
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
});
