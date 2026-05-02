import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { doctorInitials } from '../utils/doctor-initials';

const WEEK_STRIP = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export function DoctorDirectoryCard({
  doctor,
  index,
  selected,
  specialtyCompactLine,
  specialtiesAriaDescription,
  cmpLine,
  onSelect,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  index: number;
  selected: boolean;
  /** Primera especialidad y, si hay más, · +1 o · 3+. */
  specialtyCompactLine: string;
  /** Lista completa para accesibilidad (coincide con detalle / edición). */
  specialtiesAriaDescription: string;
  /** CMP del médico; siempre en línea propia para no confundirlo con una segunda especialidad. */
  cmpLine: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30, delay: index * 0.03 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={`relative rounded-[1.35rem] border bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow ${
        selected ? 'border-[#76a5af] ring-2 ring-[#76a5af]/25' : 'border-slate-100 hover:border-[#76a5af]/35'
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSelect}
          aria-current={selected ? 'true' : undefined}
          aria-label={`${doctor.name}. Especialidades: ${specialtiesAriaDescription}. CMP: ${cmpLine}`}
          className="flex min-w-0 flex-1 gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#76a5af]/40"
        >
          <div
            className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#76a5af] to-[#5d8a93] text-sm font-black text-white shadow-inner"
            aria-hidden
          >
            {doctorInitials(doctor.name)}
          </div>
          <div className="min-w-0 flex-1 pr-14">
            <p className="truncate font-bold text-[#2c3e50]">{doctor.name}</p>
            <p className="mt-1 truncate text-[11px] font-black leading-snug tracking-[0.12em] text-[#76a5af] uppercase">
              {specialtyCompactLine}
            </p>
            <p className="mt-1 truncate text-[10px] font-bold tracking-wide text-[#90a4ae] uppercase">
              CMP {cmpLine}
            </p>
          </div>
        </button>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            type="button"
            aria-label={`Editar ${doctor.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-500 shadow-sm transition-colors hover:border-[#76a5af]/40 hover:bg-white hover:text-[#76a5af]"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Eliminar ${doctor.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-500 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="mt-4 flex w-full justify-between border-t border-slate-100 pt-3 text-[10px] font-bold tracking-[0.35em] text-slate-300 uppercase"
        aria-label={`Ver detalle de ${doctor.name}`}
      >
        {WEEK_STRIP.map((d, i) => (
          <span key={`${doctor.id}-dow-${i}`}>{d}</span>
        ))}
      </button>
    </motion.article>
  );
}
