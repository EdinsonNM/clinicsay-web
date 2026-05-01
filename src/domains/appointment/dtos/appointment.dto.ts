export interface CalendarQueryDto {
  filters: AppointmentQueryFilters;
  projection: AppointmentProjectionRequest;
}

export interface AppointmentQueryFilters {
  date?: string;
  from?: string;
  to?: string;
  doctorId?: string;
  patientId?: string;
  specialtyId?: string;
}

export type ProjectionResource =
  | 'appointments'
  | 'patients'
  | 'doctors'
  | 'specialties';

export interface AppointmentProjectionRequest {
  include: Array<'patient' | 'doctor' | 'doctor.specialty'>;
  fields: Partial<Record<ProjectionResource, string[]>>;
}

export interface CreateAppointmentDto {
  date: string;
  doctorId: string;
  specialtyId: string;
  patientId?: string;
  patient?: {
    fullName: string;
    dni: string;
  };
  reason?: string;
}
