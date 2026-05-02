import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it(
    'renderiza el login cuando no hay sesión activa',
    async () => {
      render(<App />);
      expect(
        await screen.findByRole('heading', { name: /Bienvenido de nuevo/i }, { timeout: 15_000 }),
      ).toBeInTheDocument();
    },
    20_000,
  );
});
