import { describe, expect, it } from 'vitest';
import { parseAppointmentDocument, parseAppointmentListDocument } from './appointment-api.mapper';

const minimalDetail = {
  data: {
    type: 'appointments' as const,
    id: 'a1',
    attributes: {},
  },
};

const minimalList = {
  data: [
    {
      type: 'appointments' as const,
      id: 'a1',
      attributes: {},
    },
  ],
};

describe('appointment-api.mapper', () => {
  it('parseAppointmentDocument valida documento JSON', () => {
    expect(parseAppointmentDocument(minimalDetail)).toEqual(minimalDetail);
  });

  it('parseAppointmentListDocument valida lista JSON', () => {
    expect(parseAppointmentListDocument(minimalList)).toEqual(minimalList);
  });

  it('falla con JSON inválido', () => {
    expect(() => parseAppointmentDocument({})).toThrow();
  });
});
