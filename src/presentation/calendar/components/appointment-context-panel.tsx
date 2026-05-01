import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Heart,
  Search,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { AppointmentListDocument } from '../../../domains/appointment/models/appointment.model';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../domains/specialty/models/specialty.model';
import { useAppointmentCreate } from '../../../infra/appointment/hooks/use-appointment-create';
import { useAppointmentsCalendar } from '../../../infra/appointment/hooks/use-appointments-calendar';
import { useDoctorsGetBySpecialty } from '../../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../../infra/patient/hooks/use-patients-search';
import { StatusMessage } from '../../shared/status-message';

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '13:00', '14:00'];

const SPECIALTY_ICONS: LucideIcon[] = [Stethoscope, Heart, Activity, User];

function IconInput({
  label,
  icon: Icon,
  ...props
}: ComponentProps<'input'> & { label: string; icon: LucideIcon }) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</label>
      <div className="group relative">
        <Icon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-teal-500" />
        <input
          {...props}
          className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-700 outline-none transition-all focus:border-teal-200 focus:bg-white focus:ring-4 focus:ring-teal-500/5"
        />
      </div>
    </div>
  );
}

export function AppointmentContextPanel(props: {
  specialties: Specialty[];
  selectedDate: string;
  onCloseCreate: () => void;
  onDoctor: (value: string) => void;
  onPatient: (value: string) => void;
  onSpecialty: (value: string) => void;
}) {
  return <AppointmentBookingPanel {...props} />;
}

function AppointmentBookingPanel({
  specialties,
  selectedDate,
  onCloseCreate,
  onDoctor,
  onPatient,
  onSpecialty,
}: Parameters<typeof AppointmentContextPanel>[0]) {
  const [step, setStep] = useState(1);
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>('existing');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const [newPatient, setNewPatient] = useState({ fullName: '', dni: '' });
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [created, setCreated] = useState(false);

  const patients = usePatientsSearch(patientSearch);
  const doctors = useDoctorsGetBySpecialty(selectedSpecialty?.id ?? '');
  const create = useAppointmentCreate();
  const doctorDaySchedule = useAppointmentsCalendar(
    {
      filters: {
        date: selectedDate,
        ...(selectedDoctor ? { doctorId: selectedDoctor.id } : {}),
      },
      projection: {
        include: ['patient', 'doctor'],
        fields: {
          appointments: ['date', 'status', 'reason'],
          patients: ['fullName'],
          doctors: ['name'],
        },
      },
    },
    { enabled: Boolean(selectedDoctor && step === 4) },
  );
  const blockedSlots = useMemo(
    () => getBlockedTimeSlots(doctorDaySchedule.data),
    [doctorDaySchedule.data],
  );

  const canConfirm = useMemo(() => {
    const hasPatient =
      patientMode === 'existing'
        ? Boolean(selectedPatient)
        : Boolean(newPatient.fullName.trim() && newPatient.dni.trim());
    return Boolean(
      hasPatient &&
      selectedSpecialty &&
      selectedDoctor &&
      selectedTime &&
      !blockedSlots.has(selectedTime) &&
      reason.trim().length >= 4,
    );
  }, [blockedSlots, newPatient.dni, newPatient.fullName, patientMode, reason, selectedDoctor, selectedPatient, selectedSpecialty, selectedTime]);

  useEffect(() => {
    if (selectedTime && blockedSlots.has(selectedTime)) {
      setSelectedTime('');
    }
  }, [blockedSlots, selectedTime]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canConfirm || !selectedDoctor || !selectedSpecialty) return;

    await create.mutateAsync({
      date: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
      doctorId: selectedDoctor.id,
      specialtyId: selectedSpecialty.id,
      reason,
      ...(patientMode === 'existing' && selectedPatient
        ? { patientId: selectedPatient.id }
        : { patient: newPatient }),
    });
    setCreated(true);
  }

  function resetFlow() {
    setStep(1);
    setPatientMode('existing');
    setPatientSearch('');
    setSelectedPatient(undefined);
    setNewPatient({ fullName: '', dni: '' });
    setSelectedSpecialty(undefined);
    setSelectedDoctor(undefined);
    setSelectedTime('');
    setReason('');
    setCreated(false);
    onPatient('');
    onSpecialty('');
    onDoctor('');
  }

  if (created) {
    return (
      <aside
        className="relative flex h-full flex-col overflow-hidden border-l border-slate-100 bg-white p-8 lg:p-10"
        aria-label="Registro de cita completado"
      >
        <button
          type="button"
          className="absolute top-6 right-6 rounded-xl bg-slate-50 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          onClick={onCloseCreate}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-[2.5rem] bg-teal-500 text-white shadow-2xl">
            <CheckCircle2 className="h-12 w-12" aria-hidden />
          </div>
          <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-800">¡Cita lista!</h2>
          <p className="mx-auto mb-12 max-w-xs text-xs font-medium text-slate-400">
            Registro completado para{' '}
            <span className="font-bold text-slate-800">{selectedPatient?.fullName ?? newPatient.fullName}</span>.
          </p>
          <button
            type="button"
            onClick={resetFlow}
            className="w-full rounded-[1.8rem] bg-teal-500 py-5 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-teal-600"
          >
            Hacer otra reserva
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="flex h-full flex-col overflow-hidden border-l border-slate-100 bg-white p-8 shadow-2xl lg:p-10"
      aria-label="Nueva cita"
    >
      <div className="mb-8 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2" aria-label={`Paso ${step} de 4`}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-[#3ABFB4]' : 'w-2 bg-slate-100'}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          onClick={onCloseCreate}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {step === 1 && (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <h3 className="mb-2 text-2xl font-black text-slate-800">Paciente</h3>
            <p className="mb-8 text-sm font-medium text-slate-400">Gestión de identidad</p>
            <div className="mb-8 flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${patientMode === 'existing' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}
                onClick={() => setPatientMode('existing')}
              >
                Existente
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${patientMode === 'new' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}
                onClick={() => setPatientMode('new')}
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
                    onChange={(e) => setPatientSearch(e.target.value)}
                  />
                  {(patients.data?.data ?? []).map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        onPatient(patient.id);
                        setStep(2);
                      }}
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
                    onChange={(e) => setNewPatient((v) => ({ ...v, fullName: e.target.value }))}
                  />
                  <IconInput
                    label="DNI"
                    icon={User}
                    placeholder="Documento"
                    value={newPatient.dni}
                    onChange={(e) => setNewPatient((v) => ({ ...v, dni: e.target.value }))}
                  />
                  <button
                    type="button"
                    disabled={!newPatient.fullName.trim() || !newPatient.dni.trim()}
                    onClick={() => setStep(2)}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-[#3ABFB4] py-4 font-black text-white shadow-xl disabled:bg-slate-200"
                  >
                    Registrar y continuar <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <button
              type="button"
              className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>
            <h3 className="mb-8 text-2xl font-black text-slate-800">Especialidad</h3>
            <div className="space-y-3 overflow-y-auto pb-10 pr-1">
              {specialties.map((specialty, index) => {
                const SpecIcon = SPECIALTY_ICONS[index % SPECIALTY_ICONS.length];
                const palette = [
                  'bg-teal-50 text-teal-600',
                  'bg-blue-50 text-blue-600',
                  'bg-rose-50 text-rose-600',
                  'bg-indigo-50 text-indigo-600',
                ][index % 4];
                return (
                  <button
                    key={specialty.id}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialty(specialty);
                      setSelectedDoctor(undefined);
                      onSpecialty(specialty.id);
                      setStep(3);
                    }}
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
        )}

        {step === 3 && (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <button
              type="button"
              className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
              onClick={() => setStep(2)}
            >
              <ArrowLeft className="h-4 w-4" /> Especialidades
            </button>
            <h3 className="mb-8 text-2xl font-black text-slate-800">Médico</h3>
            <div className="space-y-4 overflow-y-auto pb-6">
              {(doctors.data?.data ?? []).map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    onDoctor(doctor.id);
                    setStep(4);
                  }}
                  className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.8rem] border border-slate-50 bg-slate-50/30 p-4 text-left transition-all hover:border-teal-200 hover:bg-white"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#e6f7f5] text-xs font-black text-teal-700 shadow-md">
                    {doctor.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-tight text-slate-800">{doctor.name}</p>
                    <p className="mt-0.5 text-[10px] font-black text-teal-600 uppercase">CMP {doctor.cmp}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500" />
                </button>
              ))}
              {!doctors.isLoading && (doctors.data?.data ?? []).length === 0 && (
                <p className="text-center text-sm font-bold text-slate-400">No hay médicos para esta especialidad.</p>
              )}
            </div>
          </section>
        )}

        {step === 4 && (
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={(event) => void submit(event)}>
            <button
              type="button"
              className="mb-6 flex shrink-0 items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-teal-500"
              onClick={() => setStep(3)}
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
                        onClick={() => setSelectedTime(time)}
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
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe brevemente el motivo..."
                  className="min-h-[110px] w-full resize-none rounded-[2rem] border border-slate-100 bg-slate-50 p-5 text-xs outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/5"
                />
              </div>

              {create.error ? <StatusMessage kind="alert" message={create.error.message} /> : null}

              <button
                disabled={!canConfirm || create.isPending}
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-[2.2rem] bg-[#3ABFB4] py-5 text-xs font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:bg-[#2fa89f] disabled:bg-slate-200"
              >
                {create.isPending ? 'Confirmando...' : (
                  <>
                    Confirmar cita médica <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </aside>
  );
}

export function getBlockedTimeSlots(document?: AppointmentListDocument) {
  return new Set(
    (document?.data ?? [])
      .filter((appointment) => isBlockingStatus(String(appointment.attributes.status ?? 'SCHEDULED')))
      .map((appointment) => toLocalTimeSlot(String(appointment.attributes.date ?? '')))
      .filter(Boolean),
  );
}

function toLocalTimeSlot(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isBlockingStatus(status: string) {
  return !['CANCELLED', 'CANCELED', 'CANCELADA'].includes(status.toUpperCase());
}
