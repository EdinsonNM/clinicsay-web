import type { LucideIcon } from 'lucide-react';
import { AlignLeft, ClipboardList, MoreHorizontal, Stethoscope, UserRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type {
  AppointmentListDocument,
  AppointmentResource,
  IncludedResource,
} from '../../../domains/appointment/models/appointment.model';

function byTypeAndId(
  included: IncludedResource[] | undefined,
  type: string,
  id?: string,
) {
  return included?.find((item) => item.type === type && (!id || item.id === id));
}

function relationshipId(
  appointment: AppointmentResource,
  key: 'patient' | 'doctor',
) {
  const relationship = appointment.relationships?.[key] as
    | { data?: { id?: string } }
    | undefined;
  return relationship?.data?.id;
}

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
      <div className="mb-6 flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-50 bg-white p-2 text-teal-600 shadow-sm">
            <ContextIcon className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">{contextTitle}</h3>
            <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">{contextSubtitle}</p>
          </div>
        </div>
        {hiddenCount > 0 && onViewMore ? (
          <button
            type="button"
            onClick={onViewMore}
            className="self-start rounded-2xl border border-teal-100 bg-white px-4 py-2 text-xs font-black tracking-widest text-teal-700 uppercase shadow-sm transition-all hover:bg-teal-50 hover:shadow-md"
          >
            Ver más
          </button>
        ) : null}
      </div>

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

function AppointmentCard({
  appointment,
  included,
  showContact,
  onSelect,
  isSelected,
}: {
  appointment: AppointmentResource;
  included?: IncludedResource[];
  showContact: boolean;
  onSelect: (id: string) => void;
  isSelected?: boolean;
}) {
  const patient = byTypeAndId(included, 'patients', relationshipId(appointment, 'patient'));
  const doctor = byTypeAndId(included, 'doctors', relationshipId(appointment, 'doctor'));
  const specialtyRelationship = doctor?.relationships?.specialty as
    | { data?: { id?: string } }
    | undefined;
  const specialty = byTypeAndId(
    included,
    'specialties',
    specialtyRelationship?.data?.id,
  );
  const date = String(appointment.attributes.date ?? '');
  const time = date
    ? new Date(date).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';
  const contact = patient
    ? [patient.attributes.email, patient.attributes.phone, patient.attributes.address]
        .filter(Boolean)
        .map(String)
        .join(' - ')
    : '';

  const statusRaw = String(appointment.attributes.status ?? 'SCHEDULED');
  const statusLabel =
    statusRaw === 'CONFIRMED' || statusRaw === 'Confirmada'
      ? 'Confirmada'
      : statusRaw === 'PENDING' || statusRaw === 'Pendiente'
        ? 'Pendiente'
        : statusRaw;

  const confirmed = statusLabel.toLowerCase().includes('confirm');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={`group rounded-[2.2rem] border bg-white p-5 shadow-sm transition-colors hover:border-teal-100 ${
        isSelected
          ? 'border-teal-200 ring-4 ring-teal-500/10 shadow-xl shadow-teal-500/10'
          : 'border-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex min-w-[70px] flex-col items-center justify-center border-r border-slate-50 pr-4">
            <p className="text-center text-sm leading-tight font-black text-slate-800">{time}</p>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
                <UserRound className="h-3.5 w-3.5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase">Paciente</p>
                <p className="text-xs font-bold text-slate-700">
                  {String(patient?.attributes.fullName ?? 'Paciente reservado')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
                <Stethoscope className="h-3.5 w-3.5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase">Médico</p>
                <p className="text-xs font-bold text-slate-700">
                  {String(doctor?.attributes.name ?? 'Médico por confirmar')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
                <AlignLeft className="h-3.5 w-3.5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase">Motivo</p>
                <p className="line-clamp-1 text-xs font-bold text-slate-700">
                  {String(appointment.attributes.reason ?? specialty?.attributes.name ?? '—')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-[9px] font-black uppercase ${
              confirmed ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {statusLabel}
          </span>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-900"
            aria-label="Ver detalle de cita"
            onClick={() => onSelect(appointment.id)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showContact && contact ? (
        <p className="mt-3 border-t border-slate-50 pt-3 text-xs text-slate-500">{contact}</p>
      ) : null}
    </motion.article>
  );
}

function prioritizeSelected(
  appointments: AppointmentResource[],
  selectedId?: string,
) {
  if (!selectedId) return appointments;
  const selected = appointments.find((appointment) => appointment.id === selectedId);
  if (!selected) return appointments;
  return [
    selected,
    ...appointments.filter((appointment) => appointment.id !== selectedId),
  ];
}
