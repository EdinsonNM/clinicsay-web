import type { Specialty } from '../../../domains/specialty/models/specialty.model';
import { AppointmentBookingPanel } from './booking/appointment-booking-panel';

export function AppointmentContextPanel(props: {
  specialties: Specialty[];
  selectedDate: string;
  onCloseCreate: () => void;
  onDoctor: (value: string) => void;
  onPatient: (value: string) => void;
  onSpecialty: (value: string) => void;
}) {
  return <AppointmentBookingPanel {...props} />;
}
