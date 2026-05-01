import { LoginPage } from '../../presentation/auth/login.page';
import { AppointmentsCalendarPage } from '../../presentation/calendar/appointments-calendar.page';
import { useSession } from '../providers/session.provider';

export function AppRouter() {
  const { session, setSession } = useSession();
  return session ? <AppointmentsCalendarPage /> : <LoginPage onLogin={setSession} />;
}
