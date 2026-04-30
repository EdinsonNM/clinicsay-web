import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../main/providers/app-providers';
import { AppointmentsCalendarPage } from './appointments-calendar.page';

describe('AppointmentsCalendarPage', () => {
  it('renders calendar title', () => {
    render(<AppProviders><AppointmentsCalendarPage /></AppProviders>);
    expect(screen.getByText('Calendario de citas')).toBeInTheDocument();
  });
});
