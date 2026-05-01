import { describe, expect, it } from 'vitest';
import type { AppointmentResource } from '../../../domains/appointment/models/appointment.model';
import { byTypeAndId, prioritizeSelected, relationshipId } from './appointment-list.helpers';

describe('appointment-list.helpers', () => {
  const included = [
    { type: 'patients', id: 'p1', attributes: {} },
    { type: 'doctors', id: 'd1', attributes: {} },
  ] as const;

  it('byTypeAndId encuentra por tipo e id', () => {
    expect(byTypeAndId([...included], 'patients', 'p1')?.id).toBe('p1');
    expect(byTypeAndId([...included], 'patients', 'missing')).toBeUndefined();
  });

  it('byTypeAndId con id omitido devuelve el primero del tipo', () => {
    expect(byTypeAndId([...included], 'patients')?.id).toBe('p1');
  });

  it('relationshipId lee el id de relación', () => {
    const appointment = {
      id: 'a1',
      type: 'appointments',
      attributes: {},
      relationships: { patient: { data: { id: 'p9' } } },
    } as unknown as AppointmentResource;
    expect(relationshipId(appointment, 'patient')).toBe('p9');
    expect(relationshipId({ ...appointment, relationships: {} } as AppointmentResource, 'patient')).toBeUndefined();
  });

  it('prioritizeSelected mueve la cita seleccionada al frente', () => {
    const a: AppointmentResource = { id: 'a1', type: 'appointments', attributes: {} };
    const b: AppointmentResource = { id: 'a2', type: 'appointments', attributes: {} };
    const out = prioritizeSelected([a, b], 'a2');
    expect(out[0].id).toBe('a2');
    expect(out).toHaveLength(2);
  });

  it('prioritizeSelected sin id o sin match devuelve el mismo orden', () => {
    const a: AppointmentResource = { id: 'a1', type: 'appointments', attributes: {} };
    const b: AppointmentResource = { id: 'a2', type: 'appointments', attributes: {} };
    expect(prioritizeSelected([a, b], undefined)).toEqual([a, b]);
    expect(prioritizeSelected([a, b], 'missing')).toEqual([a, b]);
  });
});
