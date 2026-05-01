import { useState } from 'react';
import type { AppointmentProjectionRequest } from '../../../domains/appointment/dtos/appointment.dto';
import type { AppointmentDocument, IncludedResource } from '../../../domains/appointment/models/appointment.model';
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
      <div className="projection-controls">
        <label><input type="checkbox" checked={includePatient} onChange={(event) => setIncludePatient(event.target.checked)} /> Paciente</label>
        <label><input type="checkbox" checked={includeDoctorSpecialty} onChange={(event) => setIncludeDoctorSpecialty(event.target.checked)} /> Medico y especialidad</label>
      </div>
      <details className="projection-fieldset">
        <summary>Campos proyectados</summary>
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
      </details>
      {detail.isLoading && <p>Cargando detalle...</p>}
      {detail.error && <p className="alert">{detail.error.message}</p>}
      {detail.data && <AppointmentProjectedDetail document={detail.data} />}
    </aside>
  );
}

function AppointmentProjectedDetail({ document }: { document: AppointmentDocument }) {
  const patient = byType(document.included, 'patients');
  const doctor = byType(document.included, 'doctors');
  const specialty = byType(document.included, 'specialties');
  const attributes = document.data.attributes;
  const date = String(attributes.date ?? '');

  return (
    <div className="projected-detail">
      <div className="detail-hero">
        <p className="eyebrow">Cita</p>
        <h3>{date ? new Date(date).toLocaleString('es-PE') : 'Fecha proyectada no solicitada'}</h3>
        <span className="status-chip">{String(attributes.status ?? 'Estado no solicitado')}</span>
      </div>
      <dl className="detail-grid">
        <div>
          <dt>Paciente</dt>
          <dd>{String(patient?.attributes.fullName ?? 'No incluido')}</dd>
        </div>
        <div>
          <dt>Documento</dt>
          <dd>{String(patient?.attributes.dni ?? 'No proyectado')}</dd>
        </div>
        <div>
          <dt>Medico</dt>
          <dd>{String(doctor?.attributes.name ?? 'No incluido')}</dd>
        </div>
        <div>
          <dt>CMP</dt>
          <dd>{String(doctor?.attributes.cmp ?? 'No proyectado')}</dd>
        </div>
        <div>
          <dt>Especialidad</dt>
          <dd>{String(specialty?.attributes.name ?? 'No incluida')}</dd>
        </div>
        <div>
          <dt>Motivo</dt>
          <dd>{String(attributes.reason ?? 'No proyectado')}</dd>
        </div>
      </dl>
      <details className="raw-evidence">
        <summary>Evidencia JSON</summary>
        <pre>{JSON.stringify(document, null, 2)}</pre>
      </details>
    </div>
  );
}

function byType(included: IncludedResource[] | undefined, type: string) {
  return included?.find((item) => item.type === type);
}
