import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Doctor } from '../../../../domains/doctor/models/doctor.model';

export function DoctorStep({
  doctors,
  isLoading,
  onBack,
  onSelectDoctor,
}: {
  doctors: Doctor[];
  isLoading: boolean;
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <button
        type="button"
        className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" /> Especialidades
      </button>
      <h3 className="mb-8 text-2xl font-black text-slate-800">Médico</h3>
      <div className="space-y-4 overflow-y-auto pb-6">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            type="button"
            onClick={() => onSelectDoctor(doctor)}
            className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.8rem] border border-slate-50 bg-slate-50/30 p-4 text-left transition-all hover:border-teal-200 hover:bg-white"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#e6f7f5] text-xs font-black text-teal-700 shadow-md">
              {doctor.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex-1">
              <p className="text-sm leading-tight font-bold text-slate-800">{doctor.name}</p>
              <p className="mt-0.5 text-[10px] font-black text-teal-600 uppercase">CMP {doctor.cmp}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500" />
          </button>
        ))}
        {!isLoading && doctors.length === 0 ? (
          <p className="text-center text-sm font-bold text-slate-400">No hay médicos para esta especialidad.</p>
        ) : null}
      </div>
    </section>
  );
}
