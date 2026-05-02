import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../core/navigation/app-routes';
import { useSession } from '../providers/session.provider';
import { AdminShell, AgendaRoute, DoctorsRoute } from './admin-shell';
import { RouteFallback } from './route-fallback';

const LoginPage = lazy(() =>
  import('../../presentation/auth/login.page').then((m) => ({ default: m.LoginPage })),
);

function RootRedirect() {
  const { session } = useSession();
  return <Navigate to={session ? APP_ROUTES.agenda : APP_ROUTES.login} replace />;
}

function RequireAuth() {
  const { session } = useSession();
  if (!session) return <Navigate to={APP_ROUTES.login} replace />;
  return <Outlet />;
}

function LoginRoute() {
  const { session, setSession } = useSession();
  const navigate = useNavigate();

  if (session) {
    return <Navigate to={APP_ROUTES.agenda} replace />;
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <LoginPage
        onLogin={(s) => {
          setSession(s);
          navigate(APP_ROUTES.agenda, { replace: true });
        }}
      />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path={APP_ROUTES.login} element={<LoginRoute />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminShell />}>
          <Route path={APP_ROUTES.agenda} element={<AgendaRoute />} />
          <Route path={APP_ROUTES.doctors} element={<DoctorsRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
