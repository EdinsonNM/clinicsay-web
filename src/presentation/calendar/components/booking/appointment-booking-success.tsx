import { CheckCircle2, X } from 'lucide-react';

export function AppointmentBookingSuccess({
  patientName,
  onCloseCreate,
  onResetFlow,
}: {
  patientName: string;
  onCloseCreate: () => void;
  onResetFlow: () => void;
}) {
  return (
    <aside
      className="relative flex h-full flex-col overflow-hidden border-l border-slate-100 bg-white p-8 lg:p-10"
      aria-label="Registro de cita completado"
    >
      <button
        type="button"
        className="absolute top-6 right-6 rounded-xl bg-slate-50 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
        onClick={onCloseCreate}
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-[2.5rem] bg-teal-500 text-white shadow-2xl">
          <CheckCircle2 className="h-12 w-12" aria-hidden />
        </div>
        <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-800">¡Cita lista!</h2>
        <p className="mx-auto mb-12 max-w-xs text-xs font-medium text-slate-400">
          Registro completado para <span className="font-bold text-slate-800">{patientName}</span>.
        </p>
        <button
          type="button"
          onClick={onResetFlow}
          className="w-full rounded-[1.8rem] bg-teal-500 py-5 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-teal-600"
        >
          Hacer otra reserva
        </button>
      </div>
    </aside>
  );
}
