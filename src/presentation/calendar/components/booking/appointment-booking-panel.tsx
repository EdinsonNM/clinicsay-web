import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toAppointmentIsoDateTime } from '../../../../core/date/date-utils';
import type { Doctor } from '../../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../../domains/specialty/models/specialty.model';
import { useAppointmentCreate } from '../../../../infra/appointment/hooks/use-appointment-create';
import { useAppointmentsCalendar } from '../../../../infra/appointment/hooks/use-appointments-calendar';
import { useDoctorsGetBySpecialty } from '../../../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../../../infra/patient/hooks/use-patients-search';
import { AppointmentBookingSuccess } from './appointment-booking-success';
import { BookingStepIndicator } from './booking-step-indicator';
import { getBlockedTimeSlots } from './booking-time-slots';
import type { NewPatientDraft, PatientMode } from './booking.types';
import { DoctorStep } from './doctor-step';
import { PatientStep } from './patient-step';
import { ScheduleStep } from './schedule-step';
import { SpecialtyStep } from './specialty-step';

export function AppointmentBookingPanel({
  specialties,
  selectedDate,
  onCloseCreate,
  onDoctor,
  onPatient,
  onSpecialty,
}: {
  specialties: Specialty[];
  selectedDate: string;
  onCloseCreate: () => void;
  onDoctor: (value: string) => void;
  onPatient: (value: string) => void;
  onSpecialty: (value: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [patientMode, setPatientMode] = useState<PatientMode>('existing');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const [newPatient, setNewPatient] = useState<NewPatientDraft>({ fullName: '', dni: '' });
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

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canConfirm || !selectedDoctor || !selectedSpecialty) return;

    await create.mutateAsync({
      date: toAppointmentIsoDateTime(selectedDate, selectedTime),
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
      <AppointmentBookingSuccess
        patientName={selectedPatient?.fullName ?? newPatient.fullName}
        onCloseCreate={onCloseCreate}
        onResetFlow={resetFlow}
      />
    );
  }

  return (
    <aside
      className="flex h-full flex-col overflow-hidden border-l border-slate-100 bg-white p-8 shadow-2xl lg:p-10"
      aria-label="Nueva cita"
    >
      <BookingStepIndicator step={step} onCloseCreate={onCloseCreate} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {step === 1 ? (
          <PatientStep
            newPatient={newPatient}
            patientMode={patientMode}
            patientSearch={patientSearch}
            patients={patients.data?.data ?? []}
            onContinueNewPatient={() => setStep(2)}
            onNewPatient={setNewPatient}
            onPatientMode={setPatientMode}
            onPatientSearch={setPatientSearch}
            onSelectPatient={(patient) => {
              setSelectedPatient(patient);
              onPatient(patient.id);
              setStep(2);
            }}
          />
        ) : null}

        {step === 2 ? (
          <SpecialtyStep
            specialties={specialties}
            onBack={() => setStep(1)}
            onSelectSpecialty={(specialty) => {
              setSelectedSpecialty(specialty);
              setSelectedDoctor(undefined);
              onSpecialty(specialty.id);
              setStep(3);
            }}
          />
        ) : null}

        {step === 3 ? (
          <DoctorStep
            doctors={doctors.data?.data ?? []}
            isLoading={doctors.isLoading}
            onBack={() => setStep(2)}
            onSelectDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              onDoctor(doctor.id);
              setStep(4);
            }}
          />
        ) : null}

        {step === 4 ? (
          <ScheduleStep
            blockedSlots={blockedSlots}
            canConfirm={canConfirm}
            errorMessage={create.error?.message}
            isPending={create.isPending}
            reason={reason}
            selectedDoctor={selectedDoctor}
            selectedSpecialty={selectedSpecialty}
            selectedTime={selectedTime}
            onBack={() => setStep(3)}
            onReason={setReason}
            onSelectedTime={setSelectedTime}
            onSubmit={submit}
          />
        ) : null}
      </div>
    </aside>
  );
}
