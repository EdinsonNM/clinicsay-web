import type { AppointmentListDocument } from '../../../../domains/appointment/models/appointment.model';

export function getBlockedTimeSlots(document?: AppointmentListDocument) {
  return new Set(
    (document?.data ?? [])
      .filter((appointment) => isBlockingStatus(String(appointment.attributes.status ?? 'SCHEDULED')))
      .map((appointment) => toLocalTimeSlot(String(appointment.attributes.date ?? '')))
      .filter(Boolean),
  );
}

function toLocalTimeSlot(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isBlockingStatus(status: string) {
  return !['CANCELLED', 'CANCELED', 'CANCELADA'].includes(status.toUpperCase());
}
