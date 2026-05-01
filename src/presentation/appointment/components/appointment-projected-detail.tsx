import { formatDateTimePe } from '../../../core/date/date-utils';
import type { AppointmentDocument, IncludedResource } from '../../../domains/appointment/models/appointment.model';

export function AppointmentProjectedDetail({ document }: { document: AppointmentDocument }) {
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
          {formatDateTimePe(date) || 'Fecha no disponible'}
        </h3>
        <span className="inline-flex rounded-full bg-[#dff7f5] px-3 py-1 text-[10px] font-bold text-teal-800">
          {String(attributes.status ?? 'Estado no disponible')}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Paciente</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(patient?.attributes.fullName ?? 'No disponible')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Documento</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(patient?.attributes.dni ?? 'No disponible')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Médico</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(doctor?.attributes.name ?? 'No disponible')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">CMP</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(doctor?.attributes.cmp ?? 'No disponible')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Especialidad</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(specialty?.attributes.name ?? 'No disponible')}</dd>
        </div>
        <div className="rounded-2xl border border-[#edf3f5] p-4">
          <dt className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Motivo</dt>
          <dd className="mt-1 font-bold text-slate-800">{String(attributes.reason ?? 'No disponible')}</dd>
        </div>
      </dl>
    </div>
  );
}

function byType(included: IncludedResource[] | undefined, type: string) {
  return included?.find((item) => item.type === type);
}
