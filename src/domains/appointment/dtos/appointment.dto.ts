export interface CalendarQueryDto {
  from: string;
  to: string;
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
