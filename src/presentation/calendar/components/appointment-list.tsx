import type { LucideIcon } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type {
  AppointmentListDocument,
} from '../../../domains/appointment/models/appointment.model';
import { AppointmentCard } from './appointment-card';
import { AppointmentListHeader } from './appointment-list-header';
import { prioritizeSelected } from './appointment-list.helpers';

export function AppointmentList({
  document,
  isLoading,
  showContact,
  onSelect,
  contextTitle,
  contextSubtitle,
  ContextIcon = ClipboardList,
  compactBottom = false,
  selectedId,
  visibleLimit,
  onViewMore,
}: {
  document?: AppointmentListDocument;
  isLoading: boolean;
  showContact: boolean;
  onSelect: (id: string) => void;
  contextTitle: string;
  contextSubtitle: string;
  ContextIcon?: LucideIcon;
  compactBottom?: boolean;
  selectedId?: string;
  visibleLimit?: number;
  onViewMore?: () => void;
}) {
  const bottomClass = compactBottom ? 'pb-8' : 'pb-20';

  if (isLoading) {
    return (
      <p className={`${bottomClass} text-center text-sm font-bold text-slate-400 italic`}>Cargando citas...</p>
    );
  }
  if (!document || document.data.length === 0) {
    return (
      <div className={bottomClass}>
        <div className="mb-6 flex items-center gap-3 px-4">
          <div className="rounded-xl border border-slate-50 bg-white p-2 text-teal-600 shadow-sm">
            <ContextIcon className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">{contextTitle}</h3>
            <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              {contextSubtitle}
            </p>
          </div>
        </div>
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/30 p-12 text-center">
          <p className="text-sm font-bold text-slate-300 italic">No hay citas para los filtros seleccionados.</p>
        </div>
      </div>
    );
  }

  const orderedAppointments = prioritizeSelected(document.data, selectedId);
  const visibleAppointments = visibleLimit
    ? orderedAppointments.slice(0, visibleLimit)
    : orderedAppointments;
  const hiddenCount = Math.max(orderedAppointments.length - visibleAppointments.length, 0);

  return (
    <div className={bottomClass}>
      <AppointmentListHeader
        ContextIcon={ContextIcon}
        contextSubtitle={contextSubtitle}
        contextTitle={contextTitle}
        showViewMore={hiddenCount > 0}
        onViewMore={onViewMore}
      />

      <motion.div layout className="flex flex-col gap-3 px-2">
        <AnimatePresence initial={false}>
          {visibleAppointments.map((appointment) => (
            <AppointmentCard
              appointment={appointment}
              included={document.included}
              isSelected={appointment.id === selectedId}
              key={appointment.id}
              onSelect={onSelect}
              showContact={showContact}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
