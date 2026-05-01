import type {
  AppointmentResource,
  IncludedResource,
} from '../../../domains/appointment/models/appointment.model';

export function byTypeAndId(
  included: IncludedResource[] | undefined,
  type: string,
  id?: string,
) {
  return included?.find((item) => item.type === type && (!id || item.id === id));
}

export function relationshipId(
  appointment: AppointmentResource,
  key: 'patient' | 'doctor',
) {
  const relationship = appointment.relationships?.[key] as
    | { data?: { id?: string } }
    | undefined;
  return relationship?.data?.id;
}

export function prioritizeSelected(
  appointments: AppointmentResource[],
  selectedId?: string,
) {
  if (!selectedId) return appointments;
  const selected = appointments.find((appointment) => appointment.id === selectedId);
  if (!selected) return appointments;
  return [
    selected,
    ...appointments.filter((appointment) => appointment.id !== selectedId),
  ];
}
