import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { dateTimeLocalToIso } from '../../../core/date/date-utils';
import {
  appointmentCreateFormSchema,
  type AppointmentCreateFormValues,
} from '../../../domains/appointment/schemas/appointment-create-form.schema';
import { useDoctorsGetBySpecialty } from '../../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../../infra/patient/hooks/use-patients-search';
import { useSpecialtiesGetAll } from '../../../infra/specialty/hooks/use-specialties-get-all';
import { useAppointmentCreate } from '../../../infra/appointment/hooks/use-appointment-create';
import { StatusMessage } from '../../shared/status-message';
import { NewPatientFields } from './new-patient-fields';

const defaultFormValues: AppointmentCreateFormValues = {
  mode: 'existing',
  search: '',
  patientId: '',
  specialtyId: '',
  doctorId: '',
  date: '2026-05-20T10:00',
  reason: 'Consulta general',
  newPatient: { fullName: '', dni: '' },
};

export function AppointmentCreateForm() {
  const form = useForm<AppointmentCreateFormValues>({
    resolver: zodResolver(appointmentCreateFormSchema),
    defaultValues: defaultFormValues,
  });

  const { register, handleSubmit, watch, setValue, formState } = form;
  const mode = watch('mode');
  const search = watch('search');
  const patientId = watch('patientId');
  const newPatient = watch('newPatient');
  const specialtyId = watch('specialtyId');
  const doctorId = watch('doctorId');
  const date = watch('date');

  const patients = usePatientsSearch(search);
  const specialties = useSpecialtiesGetAll();
  const doctors = useDoctorsGetBySpecialty(specialtyId);
  const create = useAppointmentCreate();

  const { onChange: onSpecialtyRegisterChange, ...specialtyRegister } = register('specialtyId');

  const canSubmit = useMemo(() => {
    const hasPatient = mode === 'existing' ? patientId : newPatient.fullName && newPatient.dni;
    return Boolean(hasPatient && specialtyId && doctorId && date);
  }, [date, doctorId, mode, newPatient.dni, newPatient.fullName, patientId, specialtyId]);

  async function onValidSubmit(values: AppointmentCreateFormValues) {
    await create.mutateAsync({
      date: dateTimeLocalToIso(values.date),
      doctorId: values.doctorId,
      specialtyId: values.specialtyId,
      reason: values.reason,
      ...(values.mode === 'existing' ? { patientId: values.patientId } : { patient: values.newPatient }),
    });
  }

  return (
    <form className="panel" onSubmit={(event) => void handleSubmit(onValidSubmit)(event)}>
      <h2>Nueva cita</h2>
      {create.isSuccess && <StatusMessage kind="success" message="Cita creada y calendario actualizado" />}
      {create.error && <StatusMessage message={create.error.message} />}
      <div className="checks">
        <label>
          <input type="radio" value="existing" {...register('mode')} /> Paciente existente
        </label>
        <label>
          <input type="radio" value="new" {...register('mode')} /> Paciente nuevo
        </label>
      </div>
      {mode === 'existing' ? (
        <>
          <label className="field">
            Buscar paciente
            <input {...register('search')} placeholder="Nombre o DNI" />
          </label>
          <label className="field">
            Paciente
            <select {...register('patientId')}>
              <option value="">Seleccione</option>
              {patients.data?.data.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName} - {patient.dni}
                </option>
              ))}
            </select>
          </label>
          {formState.errors.patientId ? (
            <p className="text-sm text-amber-800">{formState.errors.patientId.message}</p>
          ) : null}
        </>
      ) : (
        <>
          <NewPatientFields
            fullName={newPatient.fullName}
            dni={newPatient.dni}
            onFullName={(fullName) => setValue('newPatient.fullName', fullName, { shouldValidate: true })}
            onDni={(dni) => setValue('newPatient.dni', dni, { shouldValidate: true })}
          />
          {formState.errors.newPatient?.fullName ? (
            <p className="text-sm text-amber-800">{formState.errors.newPatient.fullName.message}</p>
          ) : null}
          {formState.errors.newPatient?.dni ? (
            <p className="text-sm text-amber-800">{formState.errors.newPatient.dni.message}</p>
          ) : null}
        </>
      )}
      <div className="field-row">
        <label className="field">
          Especialidad
          <select
            {...specialtyRegister}
            onChange={(event) => {
              onSpecialtyRegisterChange(event);
              setValue('doctorId', '');
            }}
          >
            <option value="">Seleccione</option>
            {specialties.data?.data.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Doctor
          <select {...register('doctorId')}>
            <option value="">Seleccione</option>
            {doctors.data?.data.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.cmp})
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Fecha y hora
        <input type="datetime-local" {...register('date')} />
      </label>
      <label className="field">
        Motivo
        <textarea {...register('reason')} />
      </label>
      <button type="submit" disabled={!canSubmit || create.isPending}>
        {create.isPending ? 'Creando...' : 'Crear cita'}
      </button>
    </form>
  );
}
