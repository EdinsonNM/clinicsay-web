import { describe, expect, it } from 'vitest';
import { formatIsoDate } from '../../../core/date/date-utils';
import {
  normalizeDoctor,
  parseDoctorDetailPayload,
  parseDoctorListPayload,
  parseDoctorPayload,
  relationshipDataIds,
} from './doctor-api.mapper';

describe('doctor-api.mapper', () => {
  it('normalizeDoctor prioriza specialtyIds y admite specialtyId legado', () => {
    expect(
      normalizeDoctor({ id: '1', name: 'A', cmp: 'c', specialtyIds: ['s-1', 's-2'] }),
    ).toEqual({ id: '1', name: 'A', cmp: 'c', specialtyIds: ['s-1', 's-2'] });
    expect(normalizeDoctor({ id: '2', name: 'B', cmp: 'd', specialtyId: 's-1' })).toEqual({
      id: '2',
      name: 'B',
      cmp: 'd',
      specialtyIds: ['s-1'],
    });
    expect(normalizeDoctor({ id: '3', name: 'C', cmp: 'e' })).toEqual({
      id: '3',
      name: 'C',
      cmp: 'e',
      specialtyIds: [],
    });
  });

  it('parseDoctorListPayload normaliza cada ítem', () => {
    expect(
      parseDoctorListPayload({
        data: [
          { id: '1', name: 'A', cmp: 'c', specialtyIds: ['s-1'] },
          { id: '2', name: 'B', cmp: 'd', specialtyId: 's-2' },
        ],
      }),
    ).toEqual([
      { id: '1', name: 'A', cmp: 'c', specialtyIds: ['s-1'] },
      { id: '2', name: 'B', cmp: 'd', specialtyIds: ['s-2'] },
    ]);
    expect(parseDoctorListPayload({})).toEqual([]);
    expect(parseDoctorListPayload(null)).toEqual([]);
  });

  it('parseDoctorListPayload acepta ítems JSON:API', () => {
    expect(
      parseDoctorListPayload({
        data: [
          {
            type: 'doctors',
            id: 'd1',
            attributes: { name: 'Dr. A', cmp: 'c', specialtyIds: ['s-1'] },
          },
        ],
      }),
    ).toEqual([{ id: 'd1', name: 'Dr. A', cmp: 'c', specialtyIds: ['s-1'] }]);
  });

  it('parseDoctorListPayload toma specialtyIds desde relationships.specialties si attributes no los trae', () => {
    expect(
      parseDoctorListPayload({
        data: [
          {
            type: 'doctors',
            id: 'd1',
            attributes: { name: 'Dr. B', cmp: 'cmp-1' },
            relationships: {
              specialties: { data: [{ type: 'specialties', id: 's-1' }, { type: 'specialties', id: 's-2' }] },
            },
          },
        ],
      }),
    ).toEqual([{ id: 'd1', name: 'Dr. B', cmp: 'cmp-1', specialtyIds: ['s-1', 's-2'] }]);
  });

  it('relationshipDataIds lee enlaces JSON:API', () => {
    expect(relationshipDataIds({ data: [{ type: 'appointments', id: 'a1' }] })).toEqual(['a1']);
    expect(relationshipDataIds({ data: { type: 'appointments', id: 'a2' } })).toEqual(['a2']);
    expect(relationshipDataIds({ data: null })).toEqual([]);
  });

  it('parseDoctorDetailPayload incluye contacto y especialidades', () => {
    expect(
      parseDoctorDetailPayload({
        data: {
          id: '1',
          name: 'A',
          cmp: 'c',
          specialtyIds: ['s1'],
          email: 'a@b.com',
          phone: '999',
          focusTag: 'Tag',
          specialties: [{ id: 's1', name: 'Esp' }],
        },
      }),
    ).toEqual(
      expect.objectContaining({
        id: '1',
        name: 'A',
        cmp: 'c',
        specialtyIds: ['s1'],
        email: 'a@b.com',
        phone: '999',
        focusTag: 'Tag',
        specialties: [{ id: 's1', name: 'Esp' }],
      }),
    );
    expect(
      parseDoctorDetailPayload({
        data: {
          id: '1',
          name: 'A',
          cmp: 'c',
          specialtyIds: ['s1'],
          email: 'a@b.com',
          phone: '999',
          focusTag: 'Tag',
          specialties: [{ id: 's1', name: 'Esp' }],
        },
      }).todayAppointmentsFromDetail,
    ).toBeUndefined();
  });

  it('parseDoctorDetailPayload JSON:API arma citas del día desde upcomingAppointments', () => {
    const today = formatIsoDate(new Date());
    const detail = parseDoctorDetailPayload({
      data: {
        type: 'doctors',
        id: 'd1',
        attributes: {
          name: 'Dr. X',
          cmp: 'c',
          specialtyIds: ['s1'],
          email: 'x@test.com',
        },
        relationships: {
          specialties: { data: [{ type: 'specialties', id: 's1' }] },
          upcomingAppointments: { data: [{ type: 'appointments', id: 'a1' }] },
        },
      },
      included: [
        { type: 'specialties', id: 's1', attributes: { name: 'Cardiología' } },
        {
          type: 'appointments',
          id: 'a1',
          attributes: { date: `${today}T14:30:00.000Z`, reason: 'Control' },
          relationships: { patient: { data: { type: 'patients', id: 'p1' } } },
        },
        { type: 'patients', id: 'p1', attributes: { fullName: 'Ana Paz' } },
      ],
    });

    expect(detail.specialties?.[0]?.name).toBe('Cardiología');
    expect(detail.todayAppointmentsFromDetail?.data).toHaveLength(1);
    expect(detail.todayAppointmentsFromDetail?.data[0].id).toBe('a1');
    expect(detail.todayAppointmentsFromDetail?.included?.find((i) => i.type === 'patients')?.attributes.fullName).toBe(
      'Ana Paz',
    );
  });

  it('parseDoctorDetailPayload JSON:API filtra citas que no son hoy', () => {
    const detail = parseDoctorDetailPayload({
      data: {
        type: 'doctors',
        id: 'd1',
        attributes: { name: 'Dr. X', cmp: 'c', specialtyIds: [] },
        relationships: {
          upcomingAppointments: { data: [{ type: 'appointments', id: 'a1' }] },
        },
      },
      included: [
        {
          type: 'appointments',
          id: 'a1',
          attributes: { date: '2030-01-01T10:00:00.000Z', reason: 'Futuro' },
          relationships: { patient: { data: { type: 'patients', id: 'p1' } } },
        },
        { type: 'patients', id: 'p1', attributes: { fullName: 'Bob' } },
      ],
    });

    expect(detail.todayAppointmentsFromDetail?.data).toEqual([]);
  });

  it('parseDoctorPayload acepta envoltorio data', () => {
    expect(parseDoctorPayload({ data: { id: '1', name: 'A', cmp: 'c', specialtyIds: ['s-1'] } })).toEqual({
      id: '1',
      name: 'A',
      cmp: 'c',
      specialtyIds: ['s-1'],
    });
    expect(parseDoctorPayload({ id: '2', name: 'B', cmp: 'd', specialtyIds: [] })).toEqual({
      id: '2',
      name: 'B',
      cmp: 'd',
      specialtyIds: [],
    });
  });
});
