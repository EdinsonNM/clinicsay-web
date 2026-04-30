import type { AdminSession } from '../../domains/auth/models/admin-session.model';
import { LoginPage } from '../../presentation/auth/login.page';
import { AppointmentsCalendarPage } from '../../presentation/calendar/appointments-calendar.page';

export function AppRouter({
  session,
  onLogin,
}: {
  session?: AdminSession;
  onLogin: (session: AdminSession) => void;
}) {
  return session ? <AppointmentsCalendarPage /> : <LoginPage onLogin={onLogin} />;
}
