import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Specialty } from '../../../../domains/specialty/models/specialty.model';
import { specialtyIcons, specialtyPalettes } from './booking.constants';

export function SpecialtyStep({
  specialties,
  onBack,
  onSelectSpecialty,
}: {
  specialties: Specialty[];
  onBack: () => void;
  onSelectSpecialty: (specialty: Specialty) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <button
        type="button"
        className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>
      <h3 className="mb-8 text-2xl font-black text-slate-800">Especialidad</h3>
      <div className="space-y-3 overflow-y-auto pb-10 pr-1">
        {specialties.map((specialty, index) => {
          const SpecIcon = specialtyIcons[index % specialtyIcons.length];
          const palette = specialtyPalettes[index % specialtyPalettes.length];
          return (
            <button
              key={specialty.id}
              type="button"
              onClick={() => onSelectSpecialty(specialty)}
              className="group flex w-full items-center gap-4 rounded-[1.8rem] border border-slate-50 bg-slate-50/30 p-4 text-left transition-all hover:border-teal-100 hover:bg-white"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${palette}`}
              >
                <SpecIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm leading-tight font-black text-slate-800">{specialty.name}</p>
                <p className="text-[10px] font-medium text-slate-400">Consulta especializada</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-teal-500" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
