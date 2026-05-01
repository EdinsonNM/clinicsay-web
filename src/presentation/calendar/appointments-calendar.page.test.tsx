import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../main/providers/app-providers';
import { AppointmentsCalendarPage } from './appointments-calendar.page';

describe('AppointmentsCalendarPage', () => {
  it('renders the projected agenda experience', () => {
    render(<AppProviders><AppointmentsCalendarPage /></AppProviders>);
    expect(screen.getByText('Agenda medica')).toBeInTheDocument();
    expect(screen.getByLabelText('Calendario mensual')).toBeInTheDocument();
    expect(screen.getByLabelText('Peticion generada')).toHaveTextContent('fields');
    expect(screen.getByLabelText('Filtros de agenda')).toBeInTheDocument();
  });
});
