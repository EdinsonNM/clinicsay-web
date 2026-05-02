import type { ReactNode } from 'react';
import { MobileAgendaNav } from './mobile-agenda-nav';

export { AgendaHeader } from './agenda-header';
export { AgendaSidebar } from './agenda-sidebar';

export function AgendaShell({
  sidebar,
  header,
  children,
  panel,
  mobileBookingOpen,
  onMobileToggleBooking,
}: {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  panel?: ReactNode;
  mobileBookingOpen: boolean;
  onMobileToggleBooking: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F0F7F8] font-sans selection:bg-teal-100 lg:flex-row">
      {sidebar}

      <div className="flex min-h-0 flex-1 overflow-hidden flex-col lg:flex-row">
        <section className="min-h-0 flex-1 overflow-y-auto p-6 pb-28 lg:p-10 lg:pb-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col">{header}</div>
          <div className="mx-auto flex w-full max-w-4xl flex-col">{children}</div>
        </section>

        {panel ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
              aria-label="Cerrar panel"
              onClick={onMobileToggleBooking}
            />
            <aside className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-slate-100 bg-white shadow-2xl lg:static lg:z-auto lg:h-screen lg:max-h-screen lg:max-w-[440px] lg:shrink-0 lg:shadow-none">
              {panel}
            </aside>
          </>
        ) : null}
      </div>

      <MobileAgendaNav
        mobileBookingOpen={mobileBookingOpen}
        onMobileToggleBooking={onMobileToggleBooking}
      />
    </div>
  );
}
