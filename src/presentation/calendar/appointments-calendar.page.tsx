import { useMemo, useState } from 'react';
import type {
  AppointmentProjectionRequest,
  AppointmentQueryFilters,
} from '../../domains/appointment/dtos/appointment.dto';
import { useAppointmentsCalendar } from '../../infra/appointment/hooks/use-appointments-calendar';
import { buildAppointmentQuery } from '../../infra/appointment/services/appointment-query-params';
import { useDoctorsGetBySpecialty } from '../../infra/doctor/hooks/use-doctors-get-by-specialty';
import { usePatientsSearch } from '../../infra/patient/hooks/use-patients-search';
import { useSpecialtiesGetAll } from '../../infra/specialty/hooks/use-specialties-get-all';
import { AppointmentDetailPanel } from '../appointment/components/appointment-detail-panel';
import { StatusMessage } from '../shared/status-message';
import { AgendaHeader, AgendaShell, AgendaSidebar } from './components/agenda-shell';
import { AppointmentContextPanel } from './components/appointment-context-panel';
import { AppointmentList } from './components/appointment-list';
import { CalendarMonthGrid } from './components/calendar-month-grid';
import { ProjectionHint } from './components/projection-hint';

export function AppointmentsCalendarPage() {
  const [selectedDate, setSelectedDate] = useState('2026-05-15');
  const [from, setFrom] = useState('2026-05-01');
  const [to, setTo] = useState('2026-05-31');
  const [useRange, setUseRange] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const specialties = useSpecialtiesGetAll();
  const doctors = useDoctorsGetBySpecialty(specialtyId || 's-1');
  const patients = usePatientsSearch('');

  const filters: AppointmentQueryFilters = useMemo(
    () => ({
      ...(useRange ? { from, to } : { date: selectedDate }),
      ...(doctorId ? { doctorId } : {}),
      ...(patientId ? { patientId } : {}),
      ...(specialtyId ? { specialtyId } : {}),
    }),
    [doctorId, from, patientId, selectedDate, specialtyId, to, useRange],
  );

  const projection: AppointmentProjectionRequest = useMemo(
    () => ({
      include: ['patient', 'doctor.specialty'],
      fields: {
        appointments: ['date', 'status', 'reason'],
        patients: showContact
          ? ['fullName', 'dni', 'email', 'phone', 'address']
          : ['fullName'],
        doctors: doctorId ? ['name', 'cmp'] : ['name'],
        specialties: ['name'],
      },
    }),
    [doctorId, showContact],
  );

  const query = { filters, projection };
  const calendar = useAppointmentsCalendar(query);
  const generatedQuery = buildAppointmentQuery(query);

  return (
    <AgendaShell
      header={<AgendaHeader onNew={() => setSelectedId(undefined)} />}
      panel={
        <AppointmentContextPanel
          doctorId={doctorId}
          doctors={doctors.data?.data ?? []}
          from={from}
          onDoctor={setDoctorId}
          onFrom={setFrom}
          onPatient={setPatientId}
          onShowContact={setShowContact}
          onSpecialty={setSpecialtyId}
          onTo={setTo}
          onUseRange={setUseRange}
          patientId={patientId}
          patients={patients.data?.data ?? []}
          showContact={showContact}
          specialties={specialties.data?.data ?? []}
          specialtyId={specialtyId}
          to={to}
          useRange={useRange}
        />
      }
      sidebar={<AgendaSidebar />}
    >
      <CalendarMonthGrid
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setUseRange(false);
        }}
      />
      <ProjectionHint query={generatedQuery} />
      {calendar.error && (
        <StatusMessage kind="alert" message={calendar.error.message} />
      )}
      <AppointmentList
        document={calendar.data}
        isLoading={calendar.isLoading}
        onSelect={setSelectedId}
        showContact={showContact}
      />
      <AppointmentDetailPanel appointmentId={selectedId} />
    </AgendaShell>
  );
}
