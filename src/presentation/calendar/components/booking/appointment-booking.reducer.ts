import type { Doctor } from '../../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../../domains/specialty/models/specialty.model';
import type { NewPatientDraft, PatientMode } from './booking.types';

export type BookingState = {
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

export function createInitialBookingState(): BookingState {
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

export type BookingAction =
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

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
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
