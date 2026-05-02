import { lazy, Suspense, type ReactNode } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { AgendaSidebar } from '../../presentation/calendar/components/agenda-sidebar';
import { MobileAdminSectionTabs } from '../../presentation/shared/mobile-admin-section-tabs';
import { RouteFallback } from './route-fallback';

const AppointmentsCalendarPage = lazy(() =>
  import('../../presentation/calendar/appointments-calendar.page').then((m) => ({
    default: m.AppointmentsCalendarPage,
  })),
);
const DoctorsManagementPage = lazy(() =>
  import('../../presentation/doctor/doctors-management.page').then((m) => ({
    default: m.DoctorsManagementPage,
  })),
);

type AdminOutletContext = { sidebar: ReactNode };

export function AdminShell() {
  const sidebar = <AgendaSidebar />;
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F0F7F8]">
      <MobileAdminSectionTabs />
      <div className="min-h-0 flex-1 overflow-hidden">
        <Suspense fallback={<RouteFallback />}>
          <Outlet context={{ sidebar } satisfies AdminOutletContext} />
        </Suspense>
      </div>
    </div>
  );
}

export function AgendaRoute() {
  const { sidebar } = useOutletContext<AdminOutletContext>();
  return <AppointmentsCalendarPage sidebar={sidebar} />;
}

export function DoctorsRoute() {
  const { sidebar } = useOutletContext<AdminOutletContext>();
  return <DoctorsManagementPage sidebar={sidebar} />;
}
