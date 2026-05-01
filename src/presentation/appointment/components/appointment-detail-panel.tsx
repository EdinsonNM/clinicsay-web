import { ArrowLeft } from 'lucide-react';
import type { AppointmentProjectionRequest } from '../../../domains/appointment/dtos/appointment.dto';
import { useAppointmentDetail } from '../../../infra/appointment/hooks/use-appointment-detail';
import { AppointmentProjectedDetail } from './appointment-projected-detail';

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
