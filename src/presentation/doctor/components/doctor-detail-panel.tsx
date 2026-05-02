import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo } from 'react';
import { formatIsoDate, formatShortDateEs, formatTimePe } from '../../../core/date/date-utils';
import type { AppointmentListDocument } from '../../../domains/appointment/models/appointment.model';
import type { DoctorDetail } from '../../../domains/doctor/models/doctor-detail.model';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { byTypeAndId, relationshipId } from '../../calendar/components/appointment-list.helpers';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const WEEK_DAYS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

export function DoctorDetailPanel({
  summary,
  detail,
  isDetailLoading,
  detailError,
  appointmentsDoc,
  isAppointmentsLoading,
  appointmentsError,
  specialtyLabelFallback,
  onClose,
  onEdit,
  onDelete,
}: {
  summary: Doctor;
  detail: DoctorDetail | undefined;
  isDetailLoading: boolean;
  detailError: Error | null;
  appointmentsDoc: AppointmentListDocument | undefined;
  isAppointmentsLoading: boolean;
  appointmentsError: Error | null;
  specialtyLabelFallback: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const merged = detail ?? summary;

  const specialtyNames = useMemo(() => {
    if (detail?.specialties && detail.specialties.length > 0) {
      return detail.specialties.map((s) => s.name);
    }
    const fb = specialtyLabelFallback?.trim();
    if (!fb || fb === 'Sin especialidad') return [];
    return fb.split(' · ').map((x) => x.trim()).filter(Boolean);
  }, [detail?.specialties, specialtyLabelFallback]);

  const appointmentRows = useMemo(() => {
    const included = appointmentsDoc?.included;
    return (appointmentsDoc?.data ?? [])
      .map((apt) => {
        const patient = byTypeAndId(included, 'patients', relationshipId(apt, 'patient'));
        const date = String(apt.attributes.date ?? '');
        const time = formatTimePe(date) || '--:--';
        const reason = String(apt.attributes.reason ?? '').trim();
        const patientName = String(patient?.attributes.fullName ?? 'Paciente');
        return { id: apt.id, time, patientName, reason };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointmentsDoc]);

  const todayIso = formatIsoDate(new Date());

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      className="relative flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-slate-100/80 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
      aria-labelledby="doctor-detail-name"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="Cerrar detalle"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <div className="border-b border-slate-50 px-8 pb-8 pt-10 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#76a5af] to-[#5d8a93] text-2xl font-black text-white shadow-[0_12px_32px_rgba(118,165,175,0.35)]"
            aria-hidden
          >
            {initials(merged.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="doctor-detail-name" className="text-3xl font-black tracking-tight text-[#2c3e50]">
              {merged.name}
            </h2>
            <div className="mt-4">
              <p className="text-[10px] font-black tracking-[0.2em] text-[#90a4ae] uppercase">Especialidades</p>
              {specialtyNames.length > 0 ? (
                <ul
                  className="mt-2 flex flex-wrap gap-2"
                  aria-label={`Especialidades de ${merged.name}`}
                >
                  {specialtyNames.map((name, i) => (
                    <li
                      key={`${merged.id}-spec-${i}-${name}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#76a5af]/20 bg-[#e8f4f5]/70 px-3 py-1.5 text-[11px] font-black tracking-[0.1em] text-[#76a5af] uppercase"
                    >
                      <Award className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs font-black tracking-[0.12em] text-[#76a5af] uppercase">
                  Sin especialidad
                </p>
              )}
            </div>
            {detail?.focusTag ? (
              <p className="mt-3 text-xs font-bold tracking-[0.15em] text-slate-400 uppercase">
                {detail.focusTag}
              </p>
            ) : null}
            <p className="mt-4 text-sm font-semibold text-[#90a4ae]">
              CMP <span className="text-[#2c3e50]">{merged.cmp}</span>
            </p>
            {isDetailLoading ? (
              <p className="mt-4 text-xs font-medium text-[#90a4ae]">Sincronizando ficha completa…</p>
            ) : null}
            {detailError ? (
              <p className="mt-4 text-xs font-medium text-amber-700" role="alert">
                {detailError.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 px-8 py-8 lg:flex-row lg:px-12">
        <div className="min-w-0 flex-1 space-y-8">
          <section>
            <h3 className="text-[11px] font-black tracking-[0.2em] text-[#90a4ae] uppercase">
              Canales de contacto
            </h3>
            <div className="mt-4 rounded-2xl bg-[#e8f4f5]/90 px-5 py-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#76a5af]" aria-hidden />
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#90a4ae] uppercase">
                    Correo
                  </p>
                  <p className="text-sm font-semibold text-[#2c3e50]">
                    {detail?.email ?? 'No registrado'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 border-t border-[#76a5af]/10 pt-4">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#76a5af]" aria-hidden />
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#90a4ae] uppercase">
                    Teléfono
                  </p>
                  <p className="text-sm font-semibold text-[#2c3e50]">
                    {detail?.phone ?? 'No registrado'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-black tracking-[0.2em] text-[#90a4ae] uppercase">
              Análisis de carga semanal
            </h3>
            <div className="mt-4 flex h-36 items-end justify-between gap-1 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 pb-3">
              {WEEK_DAYS.map((d) => (
                <span key={d} className="text-[9px] font-black text-slate-300">
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] font-medium text-slate-400">
              Vista resumida próximamente con datos de ocupación.
            </p>
          </section>
        </div>

        <section className="w-full shrink-0 lg:max-w-sm">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#76a5af]" aria-hidden />
            <h3 className="text-[11px] font-black tracking-[0.2em] text-[#90a4ae] uppercase">
              Próximas citas del día
            </h3>
          </div>
          <p className="mb-4 text-xs font-medium text-slate-400">{formatShortDateEs(todayIso)}</p>
          {isAppointmentsLoading ? (
            <div className="flex justify-center py-12">
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-[#76a5af]/20 border-t-[#76a5af]"
                aria-hidden
              />
            </div>
          ) : appointmentsError ? (
            <p className="text-sm font-medium text-rose-600" role="alert">
              {appointmentsError.message}
            </p>
          ) : appointmentRows.length === 0 ? (
            <p className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-8 text-center text-sm font-medium text-slate-400">
              Sin citas para hoy.
            </p>
          ) : (
            <ul className="space-y-3">
              {appointmentRows.map((row) => (
                <li key={row.id}>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#fafcfd] px-4 py-3 shadow-sm transition-colors hover:border-[#76a5af]/25">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#76a5af]">{row.time}</p>
                      <p className="truncate text-sm font-bold text-[#2c3e50]">{row.patientName}</p>
                      {row.reason ? (
                        <p className="truncate text-xs font-medium text-slate-500">{row.reason}</p>
                      ) : null}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-50 px-8 py-6 lg:px-12">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#76a5af] px-8 py-4 text-xs font-black tracking-[0.2em] text-white uppercase shadow-[0_12px_28px_rgba(118,165,175,0.35)] transition-all hover:bg-[#6a98a2] sm:flex-none"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Editar perfil
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar médico"
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-rose-500 shadow-sm transition-colors hover:bg-rose-50"
        >
          <Trash2 className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </motion.article>
  );
}
