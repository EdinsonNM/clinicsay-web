import { useState } from 'react';
import type { AppointmentProjectionRequest } from '../../../domains/appointment/dtos/appointment.dto';
import { useAppointmentDetail } from '../../../infra/appointment/hooks/use-appointment-detail';

const resources = ['appointments', 'patients', 'doctors', 'specialties'] as const;

export function AppointmentDetailPanel({ appointmentId }: { appointmentId?: string }) {
  const [includePatient, setIncludePatient] = useState(true);
  const [includeDoctorSpecialty, setIncludeDoctorSpecialty] = useState(true);
  const [fields, setFields] = useState({
    appointments: ['date', 'status'],
    patients: ['fullName'],
    doctors: ['name'],
    specialties: ['name'],
  });
  const include: AppointmentProjectionRequest['include'] = [];
  if (includePatient) include.push('patient');
  if (includeDoctorSpecialty) include.push('doctor.specialty');
  const projection: AppointmentProjectionRequest = { include, fields };
  const detail = useAppointmentDetail(appointmentId, projection);

  function toggle(resource: keyof typeof fields, field: string) {
    setFields((current) => ({
      ...current,
      [resource]: current[resource].includes(field)
        ? current[resource].filter((item) => item !== field)
        : [...current[resource], field],
    }));
  }

  if (!appointmentId) return <aside className="detail-panel">Seleccione una cita para ver el detalle.</aside>;

  return (
    <aside className="detail-panel">
      <h2>Detalle de cita</h2>
      <div className="checks">
        <label><input type="checkbox" checked={includePatient} onChange={(event) => setIncludePatient(event.target.checked)} /> patient</label>
        <label><input type="checkbox" checked={includeDoctorSpecialty} onChange={(event) => setIncludeDoctorSpecialty(event.target.checked)} /> doctor.specialty</label>
      </div>
      {resources.map((resource) => (
        <div className="checks" key={resource}>
          <strong>{resource}</strong>
          {(resource === 'appointments'
            ? ['date', 'status', 'reason']
            : resource === 'patients'
              ? ['fullName', 'dni', 'email', 'phone', 'address']
              : resource === 'doctors'
                ? ['name', 'cmp']
                : ['name']
          ).map((field) => (
            <label key={field}>
              <input
                type="checkbox"
                checked={fields[resource].includes(field)}
                onChange={() => toggle(resource, field)}
              />
              {field}
            </label>
          ))}
        </div>
      ))}
      {detail.isLoading && <p>Cargando detalle...</p>}
      {detail.error && <p className="alert">{detail.error.message}</p>}
      {detail.data && <pre>{JSON.stringify(detail.data, null, 2)}</pre>}
    </aside>
  );
}
