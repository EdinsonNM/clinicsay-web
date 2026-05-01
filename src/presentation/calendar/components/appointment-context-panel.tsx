import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import type { Patient } from '../../../domains/patient/models/patient.model';
import type { Specialty } from '../../../domains/specialty/models/specialty.model';

export function AppointmentContextPanel({
  doctors,
  patients,
  specialties,
  doctorId,
  patientId,
  specialtyId,
  showContact,
  useRange,
  from,
  to,
  onDoctor,
  onPatient,
  onSpecialty,
  onShowContact,
  onUseRange,
  onFrom,
  onTo,
}: {
  doctors: Doctor[];
  patients: Patient[];
  specialties: Specialty[];
  doctorId?: string;
  patientId?: string;
  specialtyId?: string;
  showContact: boolean;
  useRange: boolean;
  from: string;
  to: string;
  onDoctor: (value: string) => void;
  onPatient: (value: string) => void;
  onSpecialty: (value: string) => void;
  onShowContact: (value: boolean) => void;
  onUseRange: (value: boolean) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
}) {
  return (
    <aside className="agenda-panel" aria-label="Filtros de agenda">
      <p className="eyebrow">Filtros visuales</p>
      <h2>Contexto</h2>
      <label className="switch-row">
        <input
          checked={useRange}
          onChange={(event) => onUseRange(event.target.checked)}
          type="checkbox"
        />
        Usar rango de fechas
      </label>
      {useRange && (
        <div className="range-fields">
          <label>
            Desde
            <input type="date" value={from} onChange={(event) => onFrom(event.target.value)} />
          </label>
          <label>
            Hasta
            <input type="date" value={to} onChange={(event) => onTo(event.target.value)} />
          </label>
        </div>
      )}
      <label>
        Medico
        <select value={doctorId ?? ''} onChange={(event) => onDoctor(event.target.value)}>
          <option value="">Agenda global</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Paciente
        <select value={patientId ?? ''} onChange={(event) => onPatient(event.target.value)}>
          <option value="">Todos los pacientes</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Especialidad
        <select value={specialtyId ?? ''} onChange={(event) => onSpecialty(event.target.value)}>
          <option value="">Todas las areas</option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.name}
            </option>
          ))}
        </select>
      </label>
      <label className="switch-row">
        <input
          checked={showContact}
          onChange={(event) => onShowContact(event.target.checked)}
          type="checkbox"
        />
        Mostrar contacto del paciente
      </label>
    </aside>
  );
}
