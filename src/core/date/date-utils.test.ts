import { describe, expect, it } from 'vitest';
import {
  buildIsoDate,
  buildMonthCalendarCells,
  dateTimeLocalToIso,
  getMonthRange,
  parseIsoDate,
  shiftIsoMonth,
  toAppointmentIsoDateTime,
  toLocalTimeSlot,
} from './date-utils';

describe('date utils', () => {
  it('builds month ranges as ISO dates', () => {
    expect(getMonthRange('2026-02-15')).toEqual({
      from: '2026-02-01',
      to: '2026-02-28',
    });
  });

  it('keeps selected day within target month when shifting months', () => {
    expect(shiftIsoMonth('2026-05-31', 1)).toBe('2026-06-30');
  });

  it('parses and builds ISO dates', () => {
    expect(parseIsoDate('2026-05-07')).toEqual({ year: 2026, month: 5, day: 7 });
    expect(buildIsoDate(2026, 5, 7)).toBe('2026-05-07');
  });

  it('builds calendar cells with leading and trailing padding', () => {
    const cells = buildMonthCalendarCells(2026, 4);

    expect(cells.slice(0, 5)).toEqual([null, null, null, null, null]);
    expect(cells).toContain(31);
    expect(cells.length % 7).toBe(0);
  });

  it('normalizes appointment and slot times', () => {
    expect(toLocalTimeSlot('2026-05-15T09:30:00')).toBe('09:30');
    expect(toAppointmentIsoDateTime('2026-05-15', '09:30')).toBe(dateTimeLocalToIso('2026-05-15T09:30:00'));
  });
});
