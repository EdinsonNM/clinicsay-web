import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppointmentDocument } from '../../../domains/appointment/models/appointment.model';
import { AppointmentProjectedDetail } from './appointment-projected-detail';

const documentWithIncludes: AppointmentDocument = {
  data: {
    type: 'appointments',
    id: 'a1',
    attributes: {
      date: '2026-05-15T10:00:00.000Z',
      status: 'scheduled',
      reason: 'Control',
    },
  },
  included: [
    { type: 'patients', id: 'p1', attributes: { fullName: 'Ana', dni: '111' } },
    { type: 'doctors', id: 'd1', attributes: { name: 'Dr. Test', cmp: 'CMP1' } },
    { type: 'specialties', id: 's1', attributes: { name: 'Cardiología' } },
  ],
};

describe('AppointmentProjectedDetail', () => {
  it('renderiza paciente, médico y especialidad desde included', () => {
    render(<AppointmentProjectedDetail document={documentWithIncludes} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Cardiología')).toBeInTheDocument();
    expect(screen.getByText('Control')).toBeInTheDocument();
  });

  it('usa textos por defecto cuando faltan datos', () => {
    const minimal: AppointmentDocument = {
      data: {
        type: 'appointments',
        id: 'a2',
        attributes: {},
      },
    };
    render(<AppointmentProjectedDetail document={minimal} />);
    expect(screen.getAllByText('No disponible').length).toBeGreaterThan(0);
    expect(screen.getByText('Fecha no disponible')).toBeInTheDocument();
  });
});
