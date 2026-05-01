import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../main/providers/app-providers';
import { AppointmentsCalendarPage } from './appointments-calendar.page';

describe('AppointmentsCalendarPage', () => {
  it('renders the projected agenda experience', () => {
    render(<AppProviders><AppointmentsCalendarPage /></AppProviders>);
    expect(screen.getByText('Agenda medica')).toBeInTheDocument();
    expect(screen.getByLabelText('Calendario mensual')).toBeInTheDocument();
    expect(screen.queryByLabelText('Peticion generada')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Nueva cita')).not.toBeInTheDocument();
  });

  it('opens the appointment booking flow from the agenda', () => {
    render(<AppProviders><AppointmentsCalendarPage /></AppProviders>);

    fireEvent.click(screen.getByRole('button', { name: /nueva cita/i }));

    expect(screen.getByLabelText('Nueva cita')).toBeInTheDocument();
    expect(screen.getByText('Paciente')).toBeInTheDocument();
    expect(screen.getByLabelText('Paso 1 de 4')).toBeInTheDocument();
  });
});
