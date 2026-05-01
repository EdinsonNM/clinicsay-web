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

  if (!appointmentId) {
    return (
      <aside className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center text-sm font-bold text-slate-400">
        Selecciona una cita para ver el detalle y la proyección.
      </aside>
    );
  }

  return (
    <aside className="mt-8 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-black text-slate-800">Detalle de cita</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        <label className="inline-flex items-center gap-2 rounded-full bg-[#eef7f7] px-3 py-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={includePatient}
            onChange={(event) => setIncludePatient(event.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Paciente
        </label>
        <label className="inline-flex items-center gap-2 rounded-full bg-[#eef7f7] px-3 py-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={includeDoctorSpecialty}
            onChange={(event) => setIncludeDoctorSpecialty(event.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Médico y especialidad
        </label>
      </div>
      <details className="mb-6 rounded-2xl border border-[#edf3f5] p-4">
        <summary className="cursor-pointer font-bold text-slate-600">Campos proyectados</summary>
        {resources.map((resource) => (
          <div className="mt-4 flex flex-wrap gap-3" key={resource}>
            <strong className="w-full text-xs font-black tracking-wider text-slate-500 uppercase">{resource}</strong>
            {(resource === 'appointments'
              ? ['date', 'status', 'reason']
              : resource === 'patients'
                ? ['fullName', 'dni', 'email', 'phone', 'address']
                : resource === 'doctors'
                  ? ['name', 'cmp']
                  : ['name']
            ).map((field) => (
              <label key={field} className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={fields[resource].includes(field)}
                  onChange={() => toggle(resource, field)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                {field}
              </label>
            ))}
          </div>
        ))}
      </details>
      {detail.isLoading ? <p className="text-sm font-medium text-slate-500">Cargando detalle...</p> : null}
      {detail.error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{detail.error.message}</p>
      ) : null}
      {detail.data ? <AppointmentProjectedDetail document={detail.data} /> : null}
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
    <div className="grid gap-6">
      <div className="rounded-3xl bg-[#f0f7f8] p-5">
        <p className="mb-2 text-[10px] font-black tracking-wider text-slate-500 uppercase">Cita</p>
        <h3 className="mb-3 text-base font-black text-slate-800">
          {date ? new Date(date).toLocaleString('es-PE') : 'Fecha proyectada no solicitada'}
        </h3>
        <span className="inline-flex rounded-full bg-[#dff7f5] px-3 py-1 text-[10px] font-bold text-teal-800">
          {String(attributes.status ?? 'Estado no solicitado')}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Paciente</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(patient?.attributes.fullName ?? 'No incluido')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Documento</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(patient?.attributes.dni ?? 'No proyectado')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Médico</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(doctor?.attributes.name ?? 'No incluido')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">CMP</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(doctor?.attributes.cmp ?? 'No proyectado')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Especialidad</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(specialty?.attributes.name ?? 'No incluida')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Motivo</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(attributes.reason ?? 'No proyectado')}</dd>
        </div>
      </dl>
      <details className="rounded-2xl border border-[#edf3f5] p-4">
        <summary className="cursor-pointer font-bold text-slate-600">Evidencia JSON</summary>
        <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
          {JSON.stringify(document, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function byType(included: IncludedResource[] | undefined, type: string) {
  return included?.find((item) => item.type === type);
}
