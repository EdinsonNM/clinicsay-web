import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../../main/providers/app-providers';
import { AppointmentCreatePage } from './appointment-create.page';

describe('AppointmentCreatePage', () => {
  it('renderiza el formulario de nueva cita', () => {
    render(
      <AppProviders>
        <AppointmentCreatePage />
      </AppProviders>,
    );
    expect(screen.getByText('Nueva cita')).toBeInTheDocument();
  });
});
