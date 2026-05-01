import { X } from 'lucide-react';

export function BookingStepIndicator({
  step,
  onCloseCreate,
}: {
  step: number;
  onCloseCreate: () => void;
}) {
  return (
    <div className="mb-8 flex shrink-0 items-center justify-between">
      <div className="flex items-center gap-2" aria-label={`Paso ${step} de 4`}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-[#3ABFB4]' : 'w-2 bg-slate-100'}`}
          />
        ))}
      </div>
      <button
        type="button"
        className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
        onClick={onCloseCreate}
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
