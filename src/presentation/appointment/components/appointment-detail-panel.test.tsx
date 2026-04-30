import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../../main/providers/app-providers';
import { AppointmentDetailPanel } from './appointment-detail-panel';

describe('AppointmentDetailPanel', () => {
  it('prompts for appointment selection', () => {
    render(<AppProviders><AppointmentDetailPanel /></AppProviders>);
    expect(screen.getByText('Seleccione una cita para ver el detalle.')).toBeInTheDocument();
  });
});
