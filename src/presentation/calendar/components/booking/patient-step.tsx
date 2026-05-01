import { ArrowRight, ChevronRight, Search, User } from 'lucide-react';
import type { Patient } from '../../../../domains/patient/models/patient.model';
import { IconInput } from './icon-input';
import type { NewPatientDraft, PatientMode } from './booking.types';

export function PatientStep({
  patientMode,
  patientSearch,
  patients,
  newPatient,
  onPatientMode,
  onPatientSearch,
  onNewPatient,
  onSelectPatient,
  onContinueNewPatient,
}: {
  patientMode: PatientMode;
  patientSearch: string;
  patients: Patient[];
  newPatient: NewPatientDraft;
  onPatientMode: (mode: PatientMode) => void;
  onPatientSearch: (value: string) => void;
  onNewPatient: (value: NewPatientDraft) => void;
  onSelectPatient: (patient: Patient) => void;
  onContinueNewPatient: () => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <h3 className="mb-2 text-2xl font-black text-slate-800">Paciente</h3>
      <p className="mb-8 text-sm font-medium text-slate-400">Gestión de identidad</p>
      <div className="mb-8 flex rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${patientMode === 'existing' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}
          onClick={() => onPatientMode('existing')}
        >
          Existente
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${patientMode === 'new' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}
          onClick={() => onPatientMode('new')}
        >
          Nuevo
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1 pb-6">
        {patientMode === 'existing' ? (
          <div className="space-y-3">
            <IconInput
              label="Nombre o DNI"
              icon={Search}
              placeholder="Ej: nombre o documento"
              value={patientSearch}
              onChange={(e) => onPatientSearch(e.target.value)}
            />
            {patients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => onSelectPatient(patient)}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.8rem] border border-transparent bg-slate-50/50 p-4 transition-all hover:border-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-teal-600 shadow-sm">
                  {patient.fullName.slice(0, 1)}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-slate-800">{patient.fullName}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">DNI: {patient.dni}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <IconInput
              label="Nombre completo"
              icon={User}
              placeholder="Nombre completo"
              value={newPatient.fullName}
              onChange={(e) => onNewPatient({ ...newPatient, fullName: e.target.value })}
            />
            <IconInput
              label="DNI"
              icon={User}
              placeholder="Documento"
              value={newPatient.dni}
              onChange={(e) => onNewPatient({ ...newPatient, dni: e.target.value })}
            />
            <button
              type="button"
              disabled={!newPatient.fullName.trim() || !newPatient.dni.trim()}
              onClick={onContinueNewPatient}
              className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-[#3ABFB4] py-4 font-black text-white shadow-xl disabled:bg-slate-200"
            >
              Registrar y continuar <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
