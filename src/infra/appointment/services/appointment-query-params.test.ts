import { describe, expect, it } from 'vitest';
import { buildAppointmentDetailQuery } from './appointment-query-params';

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
