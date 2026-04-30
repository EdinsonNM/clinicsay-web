import { useState } from 'react';
import type { AdminSession } from '../domains/auth/models/admin-session.model';
import { AppProviders } from './providers/app-providers';
import { AppRouter } from './router/app-router';

export default function App() {
  const [session, setSession] = useState<AdminSession>();

  return (
    <AppProviders>
      <div className="app-shell">
        <header className="topbar">
          <strong>ClinicSay</strong>
          {session && <span>{session.user.name}</span>}
        </header>
        <AppRouter session={session} onLogin={setSession} />
      </div>
    </AppProviders>
  );
}
