import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../domains/specialty/models/specialty.model';
import { useAppointmentCreate } from '../../../infra/appointment/hooks/use-appointment-create';
import { useDoctorsGetBySpecialty } from '../../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../../infra/patient/hooks/use-patients-search';
import { StatusMessage } from '../../shared/status-message';

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '13:00', '14:00'];

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

  const canConfirm = useMemo(() => {
    const hasPatient =
      patientMode === 'existing'
        ? Boolean(selectedPatient)
        : Boolean(newPatient.fullName.trim() && newPatient.dni.trim());
    return Boolean(hasPatient && selectedSpecialty && selectedDoctor && selectedTime && reason.trim().length >= 4);
  }, [newPatient.dni, newPatient.fullName, patientMode, reason, selectedDoctor, selectedPatient, selectedSpecialty, selectedTime]);

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
      <aside className="agenda-panel booking-panel" aria-label="Registro de cita completado">
        <button className="panel-close" type="button" onClick={onCloseCreate}>×</button>
        <div className="success-hero" aria-hidden="true">✓</div>
        <h2>Cita lista</h2>
        <p className="muted compact">
          Registro completado para {selectedPatient?.fullName ?? newPatient.fullName}.
        </p>
        <button type="button" onClick={resetFlow}>Hacer otra reserva</button>
      </aside>
    );
  }

  return (
    <aside className="agenda-panel booking-panel" aria-label="Nueva cita">
      <div className="booking-topbar">
        <div className="step-indicator" aria-label={`Paso ${step} de 4`}>
          {[1, 2, 3, 4].map((item) => (
            <span className={step === item ? 'active' : ''} key={item} />
          ))}
        </div>
        <button className="panel-close" type="button" onClick={onCloseCreate}>×</button>
      </div>

      {step === 1 && (
        <section className="wizard-step">
          <p className="eyebrow">Identidad</p>
          <h2>Paciente</h2>
          <div className="segmented-control">
            <button className={patientMode === 'existing' ? 'active' : ''} type="button" onClick={() => setPatientMode('existing')}>Existente</button>
            <button className={patientMode === 'new' ? 'active' : ''} type="button" onClick={() => setPatientMode('new')}>Nuevo</button>
          </div>
          {patientMode === 'existing' ? (
            <>
              <label>
                Nombre o DNI
                <input value={patientSearch} onChange={(event) => setPatientSearch(event.target.value)} placeholder="Buscar paciente" />
              </label>
              <div className="option-stack">
                {(patients.data?.data ?? []).map((patient) => (
                  <button
                    className="option-card"
                    key={patient.id}
                    type="button"
                    onClick={() => {
                      setSelectedPatient(patient);
                      onPatient(patient.id);
                      setStep(2);
                    }}
                  >
                    <span className="option-avatar">{patient.fullName.slice(0, 1)}</span>
                    <span><strong>{patient.fullName}</strong><small>DNI {patient.dni}</small></span>
                    <span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="option-stack">
              <label>
                Nombre completo
                <input value={newPatient.fullName} onChange={(event) => setNewPatient((value) => ({ ...value, fullName: event.target.value }))} placeholder="Nombre completo" />
              </label>
              <label>
                DNI
                <input value={newPatient.dni} onChange={(event) => setNewPatient((value) => ({ ...value, dni: event.target.value }))} placeholder="Documento" />
              </label>
              <button
                disabled={!newPatient.fullName.trim() || !newPatient.dni.trim()}
                type="button"
                onClick={() => setStep(2)}
              >
                Registrar y continuar
              </button>
            </div>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="wizard-step">
          <button className="ghost-link" type="button" onClick={() => setStep(1)}>← Volver</button>
          <p className="eyebrow">Area medica</p>
          <h2>Especialidad</h2>
          <div className="option-stack">
            {specialties.map((specialty) => (
              <button
                className="option-card specialty-card"
                key={specialty.id}
                type="button"
                onClick={() => {
                  setSelectedSpecialty(specialty);
                  setSelectedDoctor(undefined);
                  onSpecialty(specialty.id);
                  setStep(3);
                }}
              >
                <span className="option-avatar pulse">+</span>
                <span><strong>{specialty.name}</strong><small>Consulta especializada</small></span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="wizard-step">
          <button className="ghost-link" type="button" onClick={() => setStep(2)}>← Especialidades</button>
          <p className="eyebrow">Equipo medico</p>
          <h2>Medico</h2>
          <div className="option-stack">
            {(doctors.data?.data ?? []).map((doctor) => (
              <button
                className="option-card doctor-card"
                key={doctor.id}
                type="button"
                onClick={() => {
                  setSelectedDoctor(doctor);
                  onDoctor(doctor.id);
                  setStep(4);
                }}
              >
                <span className="doctor-avatar">{doctor.name.slice(0, 2).toUpperCase()}</span>
                <span><strong>{doctor.name}</strong><small>CMP {doctor.cmp}</small></span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
            {!doctors.isLoading && (doctors.data?.data ?? []).length === 0 && (
              <p className="agenda-empty">No hay medicos para esta especialidad.</p>
            )}
          </div>
        </section>
      )}

      {step === 4 && (
        <form className="wizard-step" onSubmit={(event) => void submit(event)}>
          <button className="ghost-link" type="button" onClick={() => setStep(3)}>← Medicos</button>
          <div className="summary-card">
            <p className="eyebrow">Resumen</p>
            <h3>{selectedDoctor?.name}</h3>
            <p className="muted compact">{selectedSpecialty?.name}</p>
            <p className="muted compact">{selectedDate}</p>
          </div>
          <label>
            Horario
            <div className="time-grid">
              {timeSlots.map((time) => (
                <button
                  className={selectedTime === time ? 'selected' : ''}
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </label>
          <label>
            Motivo medico
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Describe brevemente el motivo..." />
          </label>
          {create.error && <StatusMessage kind="alert" message={create.error.message} />}
          <button disabled={!canConfirm || create.isPending} type="submit">
            {create.isPending ? 'Confirmando...' : 'Confirmar cita medica'}
          </button>
        </form>
      )}
    </aside>
  );
}
