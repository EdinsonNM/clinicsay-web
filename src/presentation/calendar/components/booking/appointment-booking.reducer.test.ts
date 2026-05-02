import { describe, expect, it } from 'vitest';
import type { Doctor } from '../../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../../domains/specialty/models/specialty.model';
import { bookingReducer, createInitialBookingState } from './appointment-booking.reducer';

const patient: Patient = { id: 'p1', fullName: 'Ana', dni: '111' };
const specialty: Specialty = { id: 's1', name: 'Cardiología' };
const doctor: Doctor = { id: 'd1', name: 'Dr. House', cmp: 'CMP1', specialtyIds: ['s1'] };

describe('createInitialBookingState', () => {
  it('inicia en paso 1 sin selección', () => {
    const state = createInitialBookingState();
    expect(state.step).toBe(1);
    expect(state.created).toBe(false);
    expect(state.selectedPatient).toBeUndefined();
    expect(state.selectedSpecialty).toBeUndefined();
    expect(state.selectedDoctor).toBeUndefined();
  });
});

describe('bookingReducer', () => {
  const initial = createInitialBookingState();

  it('RESET restaura el estado inicial', () => {
    const dirty = bookingReducer(initial, { type: 'SELECT_PATIENT', patient });
    expect(dirty.step).toBe(2);
    const reset = bookingReducer(dirty, { type: 'RESET' });
    expect(reset).toEqual(createInitialBookingState());
  });

  it('SET_STEP actualiza el paso', () => {
    expect(bookingReducer(initial, { type: 'SET_STEP', step: 4 }).step).toBe(4);
  });

  it('SET_PATIENT_MODE y SET_PATIENT_SEARCH actualizan búsqueda', () => {
    let state = bookingReducer(initial, { type: 'SET_PATIENT_MODE', patientMode: 'new' });
    expect(state.patientMode).toBe('new');
    state = bookingReducer(state, { type: 'SET_PATIENT_SEARCH', patientSearch: 'ana' });
    expect(state.patientSearch).toBe('ana');
  });

  it('SET_NEW_PATIENT guarda el borrador', () => {
    const draft = { fullName: 'Bob', dni: '222' };
    const state = bookingReducer(initial, { type: 'SET_NEW_PATIENT', newPatient: draft });
    expect(state.newPatient).toEqual(draft);
  });

  it('SELECT_PATIENT fija paciente y avanza al paso 2', () => {
    const state = bookingReducer(initial, { type: 'SELECT_PATIENT', patient });
    expect(state.selectedPatient).toEqual(patient);
    expect(state.step).toBe(2);
  });

  it('SELECT_SPECIALTY fija especialidad, limpia doctor y va al paso 3', () => {
    let state = bookingReducer(initial, { type: 'SELECT_DOCTOR', doctor });
    state = bookingReducer(state, { type: 'SELECT_SPECIALTY', specialty });
    expect(state.selectedSpecialty).toEqual(specialty);
    expect(state.selectedDoctor).toBeUndefined();
    expect(state.step).toBe(3);
  });

  it('SELECT_DOCTOR fija médico y va al paso 4', () => {
    const state = bookingReducer(initial, { type: 'SELECT_DOCTOR', doctor });
    expect(state.selectedDoctor).toEqual(doctor);
    expect(state.step).toBe(4);
  });

  it('SET_SELECTED_TIME y SET_REASON actualizan agenda', () => {
    let state = bookingReducer(initial, { type: 'SET_SELECTED_TIME', selectedTime: '10:00' });
    expect(state.selectedTime).toBe('10:00');
    state = bookingReducer(state, { type: 'SET_REASON', reason: 'Control' });
    expect(state.reason).toBe('Control');
  });

  it('MARK_CREATED marca creado sin cambiar el resto del flujo', () => {
    const state = bookingReducer(initial, { type: 'MARK_CREATED' });
    expect(state.created).toBe(true);
  });

  it('conserva el estado ante una acción no contemplada', () => {
    const looseReducer = bookingReducer as (
      state: Parameters<typeof bookingReducer>[0],
      action: { type: string },
    ) => ReturnType<typeof bookingReducer>;
    expect(looseReducer(initial, { type: '__unknown__' })).toBe(initial);
  });
});
