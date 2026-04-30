import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AdminSession } from '../../domains/auth/models/admin-session.model';
import { loginSchema } from '../../domains/auth/schemas/login.schema';
import { useAuthLogin } from '../../infra/auth/hooks/use-auth-login';
import { StatusMessage } from '../shared/status-message';

export function LoginPage({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const login = useAuthLogin();
  const loginError = login.error?.message ?? '';
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [validationError, setValidationError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Datos invalidos');
      return;
    }
    setValidationError('');
    const session = await login.mutateAsync(parsed.data);
    onLogin(session);
  }

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={(event) => void submit(event)}>
        <h1>ClinicSay Admin</h1>
        <p>Gestion de citas medicas</p>
        {(validationError || loginError) && (
          <StatusMessage message={validationError || loginError} />
        )}
        <label className="field">
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="field">
          Clave
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">{login.isPending ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </main>
  );
}
