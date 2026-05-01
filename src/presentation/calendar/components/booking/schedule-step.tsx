import { AlignLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import type { FormEvent } from 'react';
import type { Doctor } from '../../../../domains/doctor/models/doctor.model';
import type { Specialty } from '../../../../domains/specialty/models/specialty.model';
import { StatusMessage } from '../../../shared/status-message';
import { timeSlots } from './booking.constants';

export function ScheduleStep({
  selectedDoctor,
  selectedSpecialty,
  selectedTime,
  blockedSlots,
  reason,
  canConfirm,
  isPending,
  errorMessage,
  onBack,
  onSelectedTime,
  onReason,
  onSubmit,
}: {
  selectedDoctor?: Doctor;
  selectedSpecialty?: Specialty;
  selectedTime: string;
  blockedSlots: Set<string>;
  reason: string;
  canConfirm: boolean;
  isPending: boolean;
  errorMessage?: string;
  onBack: () => void;
  onSelectedTime: (value: string) => void;
  onReason: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={(event) => void onSubmit(event)}>
      <button
        type="button"
        className="mb-6 flex shrink-0 items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" /> Médicos
      </button>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pb-10 pr-1">
        <div className="rounded-[2.5rem] border border-[#3ABFB4]/20 bg-[#E6F4F1]/50 p-5">
          <p className="mb-4 text-[10px] font-black tracking-widest text-[#3ABFB4] uppercase">Resumen</p>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-teal-100 text-sm font-black text-teal-800 shadow-sm">
              {selectedDoctor?.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-base font-black text-slate-800">{selectedDoctor?.name}</p>
              <p className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                {selectedSpecialty?.name}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">Horario</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const blocked = blockedSlots.has(time);
              return (
                <button
                  key={time}
                  type="button"
                  disabled={blocked}
                  aria-label={blocked ? `${time} reservado` : `${time} disponible`}
                  onClick={() => onSelectedTime(time)}
                  className={`rounded-xl border py-3 text-[10px] font-black transition-all ${
                    blocked
                      ? 'cursor-not-allowed border-rose-100 bg-rose-50 text-rose-300 line-through'
                      : selectedTime === time
                        ? 'border-teal-400 bg-teal-500 text-white shadow-xl'
                        : 'border-slate-100 bg-white text-slate-500 hover:border-teal-200'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <AlignLeft className="h-3 w-3 text-[#3ABFB4]" aria-hidden />
            Motivo médico
          </h3>
          <textarea
            value={reason}
            onChange={(e) => onReason(e.target.value)}
            placeholder="Describe brevemente el motivo..."
            className="min-h-[110px] w-full resize-none rounded-[2rem] border border-slate-100 bg-slate-50 p-5 text-xs outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/5"
          />
        </div>

        {errorMessage ? <StatusMessage kind="alert" message={errorMessage} /> : null}

        <button
          disabled={!canConfirm || isPending}
          type="submit"
          className="group flex w-full items-center justify-center gap-3 rounded-[2.2rem] bg-[#3ABFB4] py-5 text-xs font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:bg-[#2fa89f] disabled:bg-slate-200"
        >
          {isPending ? 'Confirmando...' : (
            <>
              Confirmar cita médica <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
