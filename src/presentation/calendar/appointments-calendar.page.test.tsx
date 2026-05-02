import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../main/providers/app-providers';
import { AgendaSidebar } from './components/agenda-sidebar';
import { AppointmentsCalendarPage } from './appointments-calendar.page';

const testSidebar = <AgendaSidebar activeSection="agenda" onNavigate={() => {}} />;

describe('AppointmentsCalendarPage', () => {
  it('renders the projected agenda experience', () => {
    render(
      <AppProviders>
        <AppointmentsCalendarPage sidebar={testSidebar} />
      </AppProviders>,
    );
    expect(screen.getByRole('heading', { name: /ClinicSay/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Calendario mensual')).toBeInTheDocument();
    expect(screen.queryByLabelText('Peticion generada')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Nueva cita')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Abrir panel de reserva')).toBeInTheDocument();
  });

  it('opens the appointment booking flow from the agenda', () => {
    render(
      <AppProviders>
        <AppointmentsCalendarPage sidebar={testSidebar} />
      </AppProviders>,
    );

    fireEvent.click(screen.getByLabelText('Nueva cita (barra superior)'));

    expect(screen.getByLabelText('Nueva cita')).toBeInTheDocument();
    expect(screen.getByText('Paciente')).toBeInTheDocument();
    expect(screen.getByLabelText('Paso 1 de 4')).toBeInTheDocument();
  });
});
