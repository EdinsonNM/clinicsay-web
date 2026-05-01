import { LayoutDashboard, Plus, Settings, X } from 'lucide-react';

export function MobileAgendaNav({
  mobileBookingOpen,
  onMobileToggleBooking,
}: {
  mobileBookingOpen: boolean;
  onMobileToggleBooking: () => void;
}) {
  return (
    <nav
      className="fixed bottom-6 right-6 left-6 z-[60] flex h-20 items-center justify-around rounded-[3rem] border border-white/20 bg-white/90 px-10 shadow-2xl backdrop-blur-3xl lg:hidden"
      aria-label="Navegación principal"
    >
      <button type="button" className="text-slate-300 transition-colors hover:text-teal-600" aria-label="Panel">
        <LayoutDashboard className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={onMobileToggleBooking}
        className={`flex h-14 w-14 -translate-y-6 items-center justify-center rounded-2xl border-4 border-[#F0F7F8] text-white shadow-2xl transition-all ${
          mobileBookingOpen ? 'rotate-45 bg-rose-500' : 'bg-[#3ABFB4]'
        }`}
        aria-label={mobileBookingOpen ? 'Cerrar panel de reserva' : 'Abrir panel de reserva'}
      >
        {mobileBookingOpen ? <X className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
      </button>
      <button type="button" className="text-slate-300 transition-colors hover:text-teal-600" aria-label="Ajustes">
        <Settings className="h-6 w-6" />
      </button>
    </nav>
  );
}
