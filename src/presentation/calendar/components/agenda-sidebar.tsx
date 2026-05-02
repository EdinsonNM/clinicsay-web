import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../core/navigation/app-routes';
import type { AdminNavSection } from '../../shared/admin-nav.types';

type NavItem = {
  icon: LucideIcon;
  label: string;
  section?: AdminNavSection;
};

const items: NavItem[] = [
  { icon: LayoutDashboard, label: 'Panel' },
  { icon: CalendarIcon, label: 'Agenda', section: 'agenda' },
  { icon: Stethoscope, label: 'Médicos', section: 'doctors' },
  { icon: Users, label: 'Pacientes' },
  { icon: Settings, label: 'Ajustes' },
];

export function AgendaSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection: AdminNavSection = location.pathname.startsWith(APP_ROUTES.doctors)
    ? 'doctors'
    : 'agenda';

  function go(section: AdminNavSection) {
    navigate(section === 'agenda' ? APP_ROUTES.agenda : APP_ROUTES.doctors);
  }

  return (
    <aside
      className="hidden w-24 shrink-0 flex-col items-center gap-8 border-r border-slate-100 bg-white py-10 lg:flex"
      aria-label="Navegación principal"
    >
      <div className="mb-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-[#3ABFB4] text-white shadow-lg shadow-teal-500/20 transition-transform hover:scale-105">
        <Activity className="h-7 w-7" aria-hidden />
      </div>
      <nav className="flex flex-col gap-5" aria-label="Secciones">
        {items.map(({ icon: Icon, label, section }) => {
          const isActive = section !== undefined && activeSection === section;
          const isClickable = section !== undefined;

          return (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              disabled={!isClickable}
              onClick={() => section && go(section)}
              className={`rounded-2xl p-3.5 transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-600 shadow-sm'
                  : isClickable
                    ? 'text-slate-300 hover:text-teal-500'
                    : 'cursor-not-allowed text-slate-200'
              }`}
            >
              <Icon className="h-6 w-6" aria-hidden />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
