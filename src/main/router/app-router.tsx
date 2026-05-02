import { useState } from 'react';
import { LoginPage } from '../../presentation/auth/login.page';
import { AppointmentsCalendarPage } from '../../presentation/calendar/appointments-calendar.page';
import { AgendaSidebar } from '../../presentation/calendar/components/agenda-sidebar';
import { DoctorsManagementPage } from '../../presentation/doctor/doctors-management.page';
import type { AdminNavSection } from '../../presentation/shared/admin-nav.types';
import { MobileAdminSectionTabs } from '../../presentation/shared/mobile-admin-section-tabs';
import { useSession } from '../providers/session.provider';

export function AppRouter() {
  const { session, setSession } = useSession();
  if (!session) return <LoginPage onLogin={setSession} />;
  return <AdminApp />;
}

function AdminApp() {
  const [section, setSection] = useState<AdminNavSection>('agenda');
  const sidebar = <AgendaSidebar activeSection={section} onNavigate={setSection} />;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F0F7F8]">
      <MobileAdminSectionTabs active={section} onNavigate={setSection} />
      <div className="min-h-0 flex-1 overflow-hidden">
        {section === 'agenda' ? (
          <AppointmentsCalendarPage sidebar={sidebar} />
        ) : (
          <DoctorsManagementPage sidebar={sidebar} />
        )}
      </div>
    </div>
  );
}
