import { describe, expect, it } from 'vitest';
import type { AppointmentListDocument } from '../../../domains/appointment/models/appointment.model';
import { getBlockedTimeSlots } from './booking/booking-time-slots';

describe('getBlockedTimeSlots', () => {
  it('marks existing doctor reservations as unavailable slots', () => {
    const document: AppointmentListDocument = {
      data: [
        {
          type: 'appointments',
          id: 'a-1',
          attributes: {
            date: '2026-05-15T09:30:00',
            status: 'SCHEDULED',
          },
        },
        {
          type: 'appointments',
          id: 'a-2',
          attributes: {
            date: '2026-05-15T10:00:00',
            status: 'CANCELLED',
          },
        },
      ],
    };

    const blocked = getBlockedTimeSlots(document);

    expect(blocked.has('09:30')).toBe(true);
    expect(blocked.has('10:00')).toBe(false);
  });
});
