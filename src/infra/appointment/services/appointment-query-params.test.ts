import { describe, expect, it } from 'vitest';
import { buildAppointmentDetailQuery, buildAppointmentQuery } from './appointment-query-params';

describe('buildAppointmentDetailQuery', () => {
  it('builds bracket query params', () => {
    const query = buildAppointmentDetailQuery({
      include: ['patient', 'doctor.specialty'],
      fields: { appointments: ['date', 'status'], patients: ['fullName', 'dni'] },
    });

    expect(decodeURIComponent(query)).toContain('fields[appointments]=date,status');
    expect(decodeURIComponent(query)).toContain('fields[patients]=fullName,dni');
  });
});

describe('buildAppointmentQuery', () => {
  it('builds filters and sparse fields for the projected agenda', () => {
    const query = buildAppointmentQuery({
      filters: {
        date: '2026-05-15',
        doctorId: 'd-44',
        patientId: 'p-99',
        specialtyId: 's-1',
      },
      projection: {
        include: ['patient', 'doctor.specialty'],
        fields: {
          appointments: ['date', 'status', 'reason'],
          patients: ['fullName', 'dni', 'email', 'phone'],
          doctors: ['name', 'cmp'],
          specialties: ['name'],
        },
      },
    });

    const decoded = decodeURIComponent(query);
    expect(decoded).toContain('date=2026-05-15');
    expect(decoded).toContain('doctorId=d-44');
    expect(decoded).toContain('patientId=p-99');
    expect(decoded).toContain('specialtyId=s-1');
    expect(decoded).toContain('include=patient,doctor.specialty');
    expect(decoded).toContain('fields[appointments]=date,status,reason');
    expect(decoded).toContain('fields[patients]=fullName,dni,email,phone');
  });
});
