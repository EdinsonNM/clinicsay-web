import type { AdminNavSection } from './admin-nav.types';

export function MobileAdminSectionTabs({
  active,
  onNavigate,
}: {
  active: AdminNavSection;
  onNavigate: (section: AdminNavSection) => void;
}) {
  return (
    <nav
      aria-label="Secciones"
      className="flex shrink-0 gap-2 border-b border-white/60 bg-white/85 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md lg:hidden"
    >
      <button
        type="button"
        onClick={() => onNavigate('agenda')}
        className={`flex-1 rounded-2xl py-3 text-[11px] font-black tracking-[0.15em] text-white uppercase transition-all ${
          active === 'agenda'
            ? 'bg-[#76a5af] shadow-[0_10px_28px_rgba(118,165,175,0.35)]'
            : 'bg-slate-200/80 text-slate-500'
        }`}
      >
        Agenda
      </button>
      <button
        type="button"
        onClick={() => onNavigate('doctors')}
        className={`flex-1 rounded-2xl py-3 text-[11px] font-black tracking-[0.15em] text-white uppercase transition-all ${
          active === 'doctors'
            ? 'bg-[#76a5af] shadow-[0_10px_28px_rgba(118,165,175,0.35)]'
            : 'bg-slate-200/80 text-slate-500'
        }`}
      >
        Médicos
      </button>
    </nav>
  );
}
