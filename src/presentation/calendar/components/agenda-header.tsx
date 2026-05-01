import { Plus, Search } from 'lucide-react';

export function AgendaHeader({
  onNew,
  isBookingOpen,
}: {
  onNew: () => void;
  isBookingOpen: boolean;
}) {
  return (
    <header className="mb-8 flex shrink-0 flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl leading-tight font-black tracking-tighter text-slate-800 uppercase">ClinicSay</h1>
        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Gestión Central ClinicSay</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-300" aria-hidden />
          <input
            type="search"
            aria-label="Buscar en agenda"
            placeholder="Buscar..."
            className="focus:ring-teal-500/5 w-48 rounded-2xl border border-transparent bg-white py-3 pr-4 pl-11 text-sm font-medium shadow-sm outline-none transition-all focus:border-teal-100 focus:ring-8"
          />
        </div>

        {!isBookingOpen ? (
          <button
            type="button"
            onClick={onNew}
            aria-label="Nueva cita (barra superior)"
            className="flex items-center gap-2 rounded-2xl bg-[#3ABFB4] px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-teal-500/20 transition-all hover:bg-[#2fa89f] active:scale-95"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Nueva Cita
          </button>
        ) : null}
      </div>
    </header>
  );
}
