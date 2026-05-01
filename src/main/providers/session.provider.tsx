import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AdminSession } from '../../domains/auth/models/admin-session.model';

export type SessionContextValue = {
  session: AdminSession | undefined;
  setSession: (session: AdminSession | undefined) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | undefined>();
  const value = useMemo(() => ({ session, setSession }), [session]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return ctx;
}
