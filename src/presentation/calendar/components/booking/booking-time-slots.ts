import { toLocalTimeSlot } from '../../../../core/date/date-utils';
import type { AppointmentListDocument } from '../../../../domains/appointment/models/appointment.model';

export function getBlockedTimeSlots(document?: AppointmentListDocument) {
  return new Set(
    (document?.data ?? [])
      .filter((appointment) => isBlockingStatus(String(appointment.attributes.status ?? 'SCHEDULED')))
      .map((appointment) => toLocalTimeSlot(String(appointment.attributes.date ?? '')))
      .filter(Boolean),
  );
}

function isBlockingStatus(status: string) {
  return !['CANCELLED', 'CANCELED', 'CANCELADA'].includes(status.toUpperCase());
}
