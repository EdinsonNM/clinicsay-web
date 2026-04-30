import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useDoctorsGetBySpecialty } from '../../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../../infra/patient/hooks/use-patients-search';
import { useSpecialtiesGetAll } from '../../../infra/specialty/hooks/use-specialties-get-all';
import { useAppointmentCreate } from '../../../infra/appointment/hooks/use-appointment-create';
import { StatusMessage } from '../../shared/status-message';
import { NewPatientFields } from './new-patient-fields';

export function AppointmentCreateForm() {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [search, setSearch] = useState('');
  const [patientId, setPatientId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('2026-05-20T10:00');
  const [reason, setReason] = useState('Consulta general');
  const [newPatient, setNewPatient] = useState({ fullName: '', dni: '' });

  const patients = usePatientsSearch(search);
  const specialties = useSpecialtiesGetAll();
  const doctors = useDoctorsGetBySpecialty(specialtyId);
  const create = useAppointmentCreate();

  const canSubmit = useMemo(() => {
    const hasPatient = mode === 'existing' ? patientId : newPatient.fullName && newPatient.dni;
    return Boolean(hasPatient && specialtyId && doctorId && date);
  }, [date, doctorId, mode, newPatient.dni, newPatient.fullName, patientId, specialtyId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await create.mutateAsync({
      date: new Date(date).toISOString(),
      doctorId,
      specialtyId,
      reason,
      ...(mode === 'existing' ? { patientId } : { patient: newPatient }),
    });
  }

  return (
    <form className="panel" onSubmit={(event) => void submit(event)}>
      <h2>Nueva cita</h2>
      {create.isSuccess && <StatusMessage kind="success" message="Cita creada y calendario actualizado" />}
      {create.error && <StatusMessage message={create.error.message} />}
      <div className="checks">
        <label><input type="radio" checked={mode === 'existing'} onChange={() => setMode('existing')} /> Paciente existente</label>
        <label><input type="radio" checked={mode === 'new'} onChange={() => setMode('new')} /> Paciente nuevo</label>
      </div>
      {mode === 'existing' ? (
        <>
          <label className="field">
            Buscar paciente
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre o DNI" />
          </label>
          <label className="field">
            Paciente
            <select value={patientId} onChange={(event) => setPatientId(event.target.value)}>
              <option value="">Seleccione</option>
              {patients.data?.data.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName} - {patient.dni}</option>
              ))}
            </select>
          </label>
        </>
      ) : (
        <NewPatientFields
          fullName={newPatient.fullName}
          dni={newPatient.dni}
          onFullName={(fullName) => setNewPatient((value) => ({ ...value, fullName }))}
          onDni={(dni) => setNewPatient((value) => ({ ...value, dni }))}
        />
      )}
      <div className="field-row">
        <label className="field">
          Especialidad
          <select value={specialtyId} onChange={(event) => { setSpecialtyId(event.target.value); setDoctorId(''); }}>
            <option value="">Seleccione</option>
            {specialties.data?.data.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Doctor
          <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)}>
            <option value="">Seleccione</option>
            {doctors.data?.data.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.cmp})</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Fecha y hora
        <input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <label className="field">
        Motivo
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      <button type="submit" disabled={!canSubmit || create.isPending}>
        {create.isPending ? 'Creando...' : 'Crear cita'}
      </button>
    </form>
  );
}
