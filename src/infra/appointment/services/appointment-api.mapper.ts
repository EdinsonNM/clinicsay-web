import {
  appointmentDocumentSchema,
  appointmentListDocumentSchema,
} from '../../../domains/appointment/schemas/appointment-detail.schema';

export function parseAppointmentDocument(json: unknown) {
  return appointmentDocumentSchema.parse(json);
}

export function parseAppointmentListDocument(json: unknown) {
  return appointmentListDocumentSchema.parse(json);
}
