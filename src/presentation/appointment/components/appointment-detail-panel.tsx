import { ArrowLeft } from 'lucide-react';
import type { AppointmentProjectionRequest } from '../../../domains/appointment/dtos/appointment.dto';
import type { AppointmentDocument, IncludedResource } from '../../../domains/appointment/models/appointment.model';
import { useAppointmentDetail } from '../../../infra/appointment/hooks/use-appointment-detail';

const detailProjection: AppointmentProjectionRequest = {
  include: ['patient', 'doctor.specialty'],
  fields: {
    appointments: ['date', 'status', 'reason'],
    patients: ['fullName', 'dni'],
    doctors: ['name', 'cmp'],
    specialties: ['name'],
  },
};

export function AppointmentDetailPanel({
  appointmentId,
  onBack,
}: {
  appointmentId?: string;
  onBack?: () => void;
}) {
  const detail = useAppointmentDetail(appointmentId, detailProjection);

  if (!appointmentId) {
    return (
      <aside className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center text-sm font-bold text-slate-400">
        Selecciona una cita para ver el detalle y la proyección.
      </aside>
    );
  }

  return (
    <aside className="mt-8 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Vista enfocada</p>
          <h2 className="text-lg font-black text-slate-800">Detalle de cita</h2>
        </div>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:border-teal-100 hover:bg-teal-50 hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Regresar
          </button>
        ) : null}
      </div>
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
          {date ? new Date(date).toLocaleString('es-PE') : 'Fecha no disponible'}
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
