import { Plus, Search } from 'lucide-react';

export function DoctorsDirectoryHeader({
  search,
  onSearchChange,
  onNewDoctor,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onNewDoctor: () => void;
}) {
  return (
    <header className="mb-8 flex shrink-0 flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl leading-tight font-black tracking-tight text-[#2c3e50]">Equipo médico</h1>
        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-[#90a4ae] uppercase">Directorio de especialistas</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[200px] flex-1 md:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#90a4ae]"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar médico"
            placeholder="Buscar por nombre, CMP o especialidad…"
            className="focus:ring-[#76a5af]/10 w-full rounded-2xl border border-transparent bg-white py-3 pr-4 pl-11 text-sm font-medium text-[#2c3e50] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition-all focus:border-[#76a5af]/30 focus:ring-8"
          />
        </div>
        <button
          type="button"
          onClick={onNewDoctor}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#76a5af] px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-[0_12px_28px_rgba(118,165,175,0.35)] transition-all hover:bg-[#6a98a2] active:scale-95"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Nuevo médico
        </button>
      </div>
    </header>
  );
}
