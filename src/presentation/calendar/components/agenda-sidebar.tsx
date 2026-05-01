import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Calendar as CalendarIcon,
  History,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

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
