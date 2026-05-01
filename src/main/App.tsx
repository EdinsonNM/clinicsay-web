import { useState } from 'react';
import type { AdminSession } from '../domains/auth/models/admin-session.model';
import { AppProviders } from './providers/app-providers';
import { AppRouter } from './router/app-router';

export default function App() {
  const [session, setSession] = useState<AdminSession>();

  return (
    <AppProviders>
      {session ? (
        <div className="app-shell">
          
          <AppRouter session={session} onLogin={setSession} />
        </div>
      ) : (
        <AppRouter session={session} onLogin={setSession} />
      )}
    </AppProviders>
  );
}
