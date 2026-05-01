import type { ReactNode } from 'react';

export function AgendaShell({
  sidebar,
  header,
  children,
  panel,
}: {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  panel?: ReactNode;
}) {
  return (
    <main className={panel ? 'agenda-shell' : 'agenda-shell agenda-shell-no-panel'}>
      {sidebar}
      <section className="agenda-main">
        {header}
        {children}
      </section>
      {panel}
    </main>
  );
}

export function AgendaSidebar() {
  return (
    <aside className="agenda-sidebar" aria-label="Navegacion de agenda">
      <div className="brand-mark">CS</div>
      <nav className="sidebar-icons" aria-label="Secciones">
        <span title="Agenda">A</span>
        <span title="Pacientes">P</span>
        <span title="Medicos">M</span>
        <span title="Historial">H</span>
      </nav>
    </aside>
  );
}

export function AgendaHeader({ onNew }: { onNew: () => void }) {
  return (
    <header className="agenda-header">
      <div>
        <p className="eyebrow">ClinicSay Agenda</p>
        <h1>Agenda medica</h1>
      </div>
      <div className="agenda-header-actions">
        <input aria-label="Buscar en agenda" placeholder="Buscar..." />
        <button type="button" onClick={onNew}>
          Nueva cita
        </button>
      </div>
    </header>
  );
}
