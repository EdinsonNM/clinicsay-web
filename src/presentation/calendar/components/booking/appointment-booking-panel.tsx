import { useMemo, useReducer } from 'react';
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

type BookingState = {
  step: number;
  patientMode: PatientMode;
  patientSearch: string;
  selectedPatient: Patient | undefined;
  newPatient: NewPatientDraft;
  selectedSpecialty: Specialty | undefined;
  selectedDoctor: Doctor | undefined;
  selectedTime: string;
  reason: string;
  created: boolean;
};

function createInitialBookingState(): BookingState {
  return {
    step: 1,
    patientMode: 'existing',
    patientSearch: '',
    selectedPatient: undefined,
    newPatient: { fullName: '', dni: '' },
    selectedSpecialty: undefined,
    selectedDoctor: undefined,
    selectedTime: '',
    reason: '',
    created: false,
  };
}

type BookingAction =
  | { type: 'RESET' }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_PATIENT_MODE'; patientMode: PatientMode }
  | { type: 'SET_PATIENT_SEARCH'; patientSearch: string }
  | { type: 'SET_NEW_PATIENT'; newPatient: NewPatientDraft }
  | { type: 'SELECT_PATIENT'; patient: Patient }
  | { type: 'SELECT_SPECIALTY'; specialty: Specialty }
  | { type: 'SELECT_DOCTOR'; doctor: Doctor }
  | { type: 'SET_SELECTED_TIME'; selectedTime: string }
  | { type: 'SET_REASON'; reason: string }
  | { type: 'MARK_CREATED' };

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'RESET':
      return createInitialBookingState();
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_PATIENT_MODE':
      return { ...state, patientMode: action.patientMode };
    case 'SET_PATIENT_SEARCH':
      return { ...state, patientSearch: action.patientSearch };
    case 'SET_NEW_PATIENT':
      return { ...state, newPatient: action.newPatient };
    case 'SELECT_PATIENT':
      return { ...state, selectedPatient: action.patient, step: 2 };
    case 'SELECT_SPECIALTY':
      return { ...state, selectedSpecialty: action.specialty, selectedDoctor: undefined, step: 3 };
    case 'SELECT_DOCTOR':
      return { ...state, selectedDoctor: action.doctor, step: 4 };
    case 'SET_SELECTED_TIME':
      return { ...state, selectedTime: action.selectedTime };
    case 'SET_REASON':
      return { ...state, reason: action.reason };
    case 'MARK_CREATED':
      return { ...state, created: true };
    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(bookingReducer, undefined, createInitialBookingState);

  const {
    step,
    patientMode,
    patientSearch,
    selectedPatient,
    newPatient,
    selectedSpecialty,
    selectedDoctor,
    selectedTime,
    reason,
    created,
  } = state;

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
    dispatch({ type: 'MARK_CREATED' });
  }

  function resetFlow() {
    dispatch({ type: 'RESET' });
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
            onContinueNewPatient={() => dispatch({ type: 'SET_STEP', step: 2 })}
            onNewPatient={(value) => dispatch({ type: 'SET_NEW_PATIENT', newPatient: value })}
            onPatientMode={(patientMode) => dispatch({ type: 'SET_PATIENT_MODE', patientMode })}
            onPatientSearch={(patientSearch) => dispatch({ type: 'SET_PATIENT_SEARCH', patientSearch })}
            onSelectPatient={(patient) => {
              dispatch({ type: 'SELECT_PATIENT', patient });
              onPatient(patient.id);
            }}
          />
        ) : null}

        {step === 2 ? (
          <SpecialtyStep
            specialties={specialties}
            onBack={() => dispatch({ type: 'SET_STEP', step: 1 })}
            onSelectSpecialty={(specialty) => {
              dispatch({ type: 'SELECT_SPECIALTY', specialty });
              onSpecialty(specialty.id);
            }}
          />
        ) : null}

        {step === 3 ? (
          <DoctorStep
            doctors={doctors.data?.data ?? []}
            isLoading={doctors.isLoading}
            onBack={() => dispatch({ type: 'SET_STEP', step: 2 })}
            onSelectDoctor={(doctor) => {
              dispatch({ type: 'SELECT_DOCTOR', doctor });
              onDoctor(doctor.id);
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
            onBack={() => dispatch({ type: 'SET_STEP', step: 3 })}
            onReason={(reason) => dispatch({ type: 'SET_REASON', reason })}
            onSelectedTime={(selectedTime) => dispatch({ type: 'SET_SELECTED_TIME', selectedTime })}
            onSubmit={submit}
          />
        ) : null}
      </div>
    </aside>
  );
}
