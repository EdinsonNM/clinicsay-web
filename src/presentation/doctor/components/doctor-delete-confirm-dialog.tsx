import type { Doctor } from '../../../domains/doctor/models/doctor.model';

export function DoctorDeleteConfirmDialog({
  doctor,
  isDeleting,
  errorMessage,
  onDismiss,
  onConfirm,
}: {
  doctor: Doctor;
  isDeleting: boolean;
  errorMessage?: string;
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2c3e50]/40 p-6 backdrop-blur-sm"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-doctor-title"
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-doctor-title" className="text-lg font-bold text-[#2c3e50]">
          ¿Eliminar médico?
        </h2>
        <p className="mt-3 text-sm leading-relaxed font-medium text-[#90a4ae]">
          Se quitará <span className="font-bold text-[#2c3e50]">{doctor.name}</span> del directorio. Las citas existentes
          pueden verse afectadas según la configuración del servidor.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => void onConfirm()}
            className="rounded-2xl bg-rose-500 px-6 py-3.5 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 disabled:bg-slate-300"
          >
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-2xl border-2 border-[#76a5af]/35 bg-white px-6 py-3.5 text-xs font-black tracking-widest text-[#76a5af] uppercase hover:bg-[#f0f7f8]"
          >
            Cancelar
          </button>
        </div>
        {errorMessage ? (
          <p className="mt-4 text-sm font-medium text-rose-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
