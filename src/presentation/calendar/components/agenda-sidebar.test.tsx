import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgendaSidebar } from './agenda-sidebar';

describe('AgendaSidebar', () => {
  it('notifica navegación al pulsar Agenda o Médicos', () => {
    const onNavigate = vi.fn();
    render(<AgendaSidebar activeSection="doctors" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /agenda/i, hidden: true }));
    expect(onNavigate).toHaveBeenCalledWith('agenda');

    fireEvent.click(screen.getByRole('button', { name: /médicos/i, hidden: true }));
    expect(onNavigate).toHaveBeenCalledWith('doctors');
  });
});
