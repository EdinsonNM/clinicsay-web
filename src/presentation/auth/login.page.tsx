import { Activity, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AdminSession } from '../../domains/auth/models/admin-session.model';
import { loginSchema } from '../../domains/auth/schemas/login.schema';
import { useAuthLogin } from '../../infra/auth/hooks/use-auth-login';
import { LoginInputField } from './login-input-field';

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

  const errorMessage = validationError || loginError;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F0F7F8] p-6 font-sans selection:bg-teal-100">
      <div className="absolute top-[-10%] -left-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#3ABFB4]/5 blur-[100px]" aria-hidden />
      <div
        className="absolute -right-[5%] bottom-[-5%] h-[30%] w-[30%] rounded-full bg-blue-500/5 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-[1100px] flex-col overflow-hidden rounded-[3.5rem] border border-white/50 bg-white/40 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl md:flex-row">
        <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[#3ABFB4] p-12 md:flex lg:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#login-grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#3ABFB4] shadow-xl">
              <Activity className="h-8 w-8" aria-hidden />
            </div>
            <h1 className="text-4xl leading-tight font-black tracking-tighter text-white uppercase lg:text-5xl">
              Transformando <br />
              la Gestión <br />
              Médica.
            </h1>
            <div className="mt-6 h-1.5 w-16 rounded-full bg-white/30" />
          </div>

          <div className="relative z-10">
            <div className="rounded-[2.5rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <ShieldCheck className="h-6 w-6 text-[#3ABFB4]" aria-hidden />
                </div>
                <p className="text-sm font-bold text-white">Plataforma Asegurada</p>
              </div>
              <p className="text-xs leading-relaxed font-medium text-white/70">
                Acceso restringido para personal autorizado de ClinicSay. Entorno administrativo con medidas de
                protección de datos según buenas prácticas del sector salud.
              </p>
            </div>
            <p className="mt-8 text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              ClinicSay Admin
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center bg-white/80 p-8 lg:p-20">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-10 text-center md:text-left">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3ABFB4] text-white shadow-lg md:hidden">
                <Activity className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-800">Bienvenido de nuevo</h2>
              <p className="text-sm font-medium text-slate-400">Ingresa tus credenciales de administrador</p>
            </header>

            <form className="space-y-6" onSubmit={(event) => void submit(event)} noValidate>
              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
                >
                  {errorMessage}
                </div>
              ) : null}

              <LoginInputField
                id="login-username"
                label="Usuario"
                icon={Mail}
                type="text"
                placeholder="usuario@clinicsay.com"
                value={username}
                onChange={setUsername}
                autoComplete="username"
              />

              <div className="space-y-1">
                <LoginInputField
                  id="login-password"
                  label="Contraseña"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />
                <div className="flex justify-end pr-2">
                  <button
                    type="button"
                    className="text-[10px] font-black tracking-widest text-[#3ABFB4] uppercase hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={login.isPending}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[2rem] bg-[#3ABFB4] py-5 font-black text-white shadow-2xl shadow-[#3ABFB4]/30 transition-all hover:bg-[#2fa89f] active:scale-[0.98] disabled:bg-slate-200"
                >
                  {login.isPending ? (
                    <div
                      className="h-6 w-6 animate-spin rounded-full border-4 border-white/30 border-t-white"
                      aria-hidden
                    />
                  ) : (
                    <>
                      <span className="text-sm tracking-[0.1em] uppercase">Iniciar Sesión</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-xs font-medium text-slate-400">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  className="font-black tracking-widest text-[#3ABFB4] uppercase hover:underline"
                >
                  Solicitar Acceso
                </button>
              </p>
            </footer>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">
        <button type="button" className="transition-colors hover:text-slate-500">
          Privacidad
        </button>
        <div className="h-1 w-1 rounded-full bg-slate-200" aria-hidden />
        <button type="button" className="transition-colors hover:text-slate-500">
          Términos
        </button>
        <div className="h-1 w-1 rounded-full bg-slate-200" aria-hidden />
        <button type="button" className="transition-colors hover:text-slate-500">
          Soporte Técnico
        </button>
      </div>
    </main>
  );
}
