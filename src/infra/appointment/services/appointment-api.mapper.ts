import { appointmentDocumentSchema } from '../../../domains/appointment/schemas/appointment-detail.schema';

export function parseAppointmentDocument(json: unknown) {
  return appointmentDocumentSchema.parse(json);
}
