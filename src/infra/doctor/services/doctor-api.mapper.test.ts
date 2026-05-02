import { describe, expect, it } from 'vitest';
import { normalizeDoctor, parseDoctorListPayload, parseDoctorPayload } from './doctor-api.mapper';

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
