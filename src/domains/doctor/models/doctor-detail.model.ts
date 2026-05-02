import type { AppointmentListDocument } from '../../appointment/models/appointment.model';
import type { Doctor } from './doctor.model';

/** Especialidad expandida en detalle (si la API la incluye). */
export interface DoctorSpecialtyRef {
  id: string;
  name: string;
}

/** Detalle completo del médico (GET /doctors/:id). El listado solo usa {@link Doctor}. */
export interface DoctorDetail extends Doctor {
  email?: string;
  phone?: string;
  /** Subtítulo / foco clínico (ej. alergias complejas). */
  focusTag?: string;
  /** Si el servidor envía especialidades resueltas. */
  specialties?: DoctorSpecialtyRef[];
  /**
   * Citas de hoy desde JSON:API (`relationships.upcomingAppointments` + `included`).
   * Si viene informado (aunque sea lista vacía), el cliente no necesita GET /appointments para el día.
   */
  todayAppointmentsFromDetail?: AppointmentListDocument;
}
