import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileAdminSectionTabs } from './mobile-admin-section-tabs';

describe('MobileAdminSectionTabs', () => {
  it('notifica al cambiar de sección', () => {
    const onNavigate = vi.fn();
    render(<MobileAdminSectionTabs active="agenda" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: 'Médicos' }));
    expect(onNavigate).toHaveBeenCalledWith('doctors');

    fireEvent.click(screen.getByRole('button', { name: 'Agenda' }));
    expect(onNavigate).toHaveBeenCalledWith('agenda');
  });
});
