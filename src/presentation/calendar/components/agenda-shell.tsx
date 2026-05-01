import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
  History,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';

export function AgendaShell({
  sidebar,
  header,
  children,
  panel,
  mobileBookingOpen,
  onMobileToggleBooking,
}: {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  panel?: ReactNode;
  mobileBookingOpen: boolean;
  onMobileToggleBooking: () => void;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F0F7F8] font-sans selection:bg-teal-100 lg:flex-row">
      {sidebar}

      <div className="flex min-h-0 flex-1 overflow-hidden flex-col lg:flex-row">
        <section className="min-h-0 flex-1 overflow-y-auto p-6 pb-28 lg:p-10 lg:pb-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col">{header}</div>
          <div className="mx-auto flex w-full max-w-4xl flex-col">{children}</div>
        </section>

        {panel ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
              aria-label="Cerrar panel"
              onClick={onMobileToggleBooking}
            />
            <aside className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-slate-100 bg-white shadow-2xl lg:static lg:z-auto lg:h-screen lg:max-h-screen lg:max-w-[440px] lg:shrink-0 lg:shadow-none">
              {panel}
            </aside>
          </>
        ) : null}
      </div>

      <nav
        className="fixed bottom-6 left-6 right-6 z-[60] flex h-20 items-center justify-around rounded-[3rem] border border-white/20 bg-white/90 px-10 shadow-2xl backdrop-blur-3xl lg:hidden"
        aria-label="Navegación principal"
      >
        <button type="button" className="text-slate-300 transition-colors hover:text-teal-600" aria-label="Panel">
          <LayoutDashboard className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onMobileToggleBooking}
          className={`flex h-14 w-14 -translate-y-6 items-center justify-center rounded-2xl border-4 border-[#F0F7F8] text-white shadow-2xl transition-all ${
            mobileBookingOpen ? 'rotate-45 bg-rose-500' : 'bg-[#3ABFB4]'
          }`}
          aria-label={mobileBookingOpen ? 'Cerrar panel de reserva' : 'Abrir panel de reserva'}
        >
          {mobileBookingOpen ? <X className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
        </button>
        <button type="button" className="text-slate-300 transition-colors hover:text-teal-600" aria-label="Ajustes">
          <Settings className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}

export function AgendaSidebar() {
  const items: { icon: LucideIcon; label: string; active?: boolean }[] = [
    { icon: LayoutDashboard, label: 'Panel' },
    { icon: CalendarIcon, label: 'Agenda', active: true },
    { icon: Users, label: 'Pacientes' },
    { icon: History, label: 'Historial' },
    { icon: Settings, label: 'Ajustes' },
  ];

  return (
    <aside
      className="hidden w-24 shrink-0 flex-col items-center gap-8 border-r border-slate-100 bg-white py-10 lg:flex"
      aria-label="Navegación de agenda"
    >
      <div className="mb-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-[#3ABFB4] text-white shadow-lg shadow-teal-500/20 transition-transform hover:scale-105">
        <Activity className="h-7 w-7" aria-hidden />
      </div>
      <nav className="flex flex-col gap-5" aria-label="Secciones">
        {items.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={`rounded-2xl p-3.5 transition-all ${
              active ? 'bg-teal-50 text-teal-600 shadow-sm' : 'text-slate-300 hover:text-teal-500'
            }`}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </button>
        ))}
      </nav>
    </aside>
  );
}

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
