import { describe, expect, it } from 'vitest';
import { appointmentCreateFormSchema } from './appointment-create-form.schema';

const base = {
  search: '',
  specialtyId: 's1',
  doctorId: 'd1',
  date: '2026-05-20T10:00',
  reason: 'Consulta',
  newPatient: { fullName: '', dni: '' },
};

describe('appointmentCreateFormSchema', () => {
  it('acepta modo existente con paciente seleccionado', () => {
    const parsed = appointmentCreateFormSchema.safeParse({
      ...base,
      mode: 'existing' as const,
      patientId: 'p1',
    });
    expect(parsed.success).toBe(true);
  });

  it('rechaza modo existente sin patientId', () => {
    const parsed = appointmentCreateFormSchema.safeParse({
      ...base,
      mode: 'existing' as const,
      patientId: '',
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path.includes('patientId'))).toBe(true);
    }
  });

  it('acepta modo nuevo con datos de paciente válidos', () => {
    const parsed = appointmentCreateFormSchema.safeParse({
      ...base,
      mode: 'new' as const,
      patientId: '',
      newPatient: { fullName: 'María López', dni: '12345' },
    });
    expect(parsed.success).toBe(true);
  });

  it('rechaza modo nuevo con newPatient inválido', () => {
    const parsed = appointmentCreateFormSchema.safeParse({
      ...base,
      mode: 'new' as const,
      patientId: '',
      newPatient: { fullName: 'x', dni: 'y' },
    });
    expect(parsed.success).toBe(false);
  });

  it('rechaza especialidad o doctor vacíos', () => {
    const parsed = appointmentCreateFormSchema.safeParse({
      ...base,
      mode: 'existing' as const,
      patientId: 'p1',
      specialtyId: '',
    });
    expect(parsed.success).toBe(false);
  });
});
