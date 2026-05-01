import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renderiza el login cuando no hay sesión activa', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Bienvenido de nuevo/i })).toBeInTheDocument();
  });
});
