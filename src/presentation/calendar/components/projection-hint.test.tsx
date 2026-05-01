import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectionHint } from './projection-hint';

describe('ProjectionHint', () => {
  it('muestra la petición GET con query vacía como ?', () => {
    render(<ProjectionHint query="" />);
    expect(screen.getByLabelText(/Peticion generada/i)).toHaveTextContent('GET /appointments?');
  });

  it('concatena query cuando existe', () => {
    render(<ProjectionHint query="?date=2026-05-01" />);
    expect(screen.getByLabelText(/Peticion generada/i)).toHaveTextContent('date=2026-05-01');
  });
});
