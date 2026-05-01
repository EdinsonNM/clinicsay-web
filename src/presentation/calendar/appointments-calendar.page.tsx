import { CalendarCheck, ClipboardList, History } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type {
  AppointmentProjectionRequest,
  AppointmentQueryFilters,
} from '../../domains/appointment/dtos/appointment.dto';
import { useAppointmentsCalendar } from '../../infra/appointment/hooks/use-appointments-calendar';
import { useSpecialtiesGetAll } from '../../infra/specialty/hooks/use-specialties-get-all';
import { AppointmentDetailPanel } from '../appointment/components/appointment-detail-panel';
import { StatusMessage } from '../shared/status-message';
import { AgendaHeader, AgendaShell, AgendaSidebar } from './components/agenda-shell';
import { AppointmentContextPanel } from './components/appointment-context-panel';
import { AppointmentList } from './components/appointment-list';
import { CalendarMonthGrid } from './components/calendar-month-grid';

export function AppointmentsCalendarPage() {
  const [selectedDate, setSelectedDate] = useState('2026-05-15');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const specialties = useSpecialtiesGetAll();
  const monthRange = useMemo(() => getMonthRange(selectedDate), [selectedDate]);

  const filters: AppointmentQueryFilters = useMemo(
    () => ({
      from: monthRange.from,
      to: monthRange.to,
      ...(doctorId ? { doctorId } : {}),
      ...(patientId ? { patientId } : {}),
      ...(specialtyId ? { specialtyId } : {}),
    }),
    [doctorId, monthRange.from, monthRange.to, patientId, specialtyId],
  );

  const projection: AppointmentProjectionRequest = useMemo(
    () => ({
      include: ['patient', 'doctor.specialty'],
      fields: {
        appointments: ['date', 'status', 'reason'],
        patients: ['fullName'],
        doctors: doctorId ? ['name', 'cmp'] : ['name'],
        specialties: ['name'],
      },
    }),
    [doctorId],
  );

  const query = { filters, projection };
  const calendar = useAppointmentsCalendar(query);
  const selectedDayDocument = useMemo(() => {
    if (!calendar.data) return undefined;
    return {
      ...calendar.data,
      data: calendar.data.data.filter((appointment) =>
        String(appointment.attributes.date ?? '').startsWith(selectedDate),
      ),
    };
  }, [calendar.data, selectedDate]);
  const appointmentDates = useMemo(
    () =>
      new Set(
        (calendar.data?.data ?? [])
          .map((appointment) => String(appointment.attributes.date ?? '').slice(0, 10))
          .filter(Boolean),
      ),
    [calendar.data],
  );

  const navigateMonth = useCallback((delta: number) => {
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setMonth(d.getMonth() + delta);
    const y = d.getFullYear();
    const m = d.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    const prevDay = Math.min(Number(selectedDate.slice(8, 10)) || 1, lastDay);
    setSelectedDate(`${y}-${String(m + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`);
  }, [selectedDate]);

  const contextTitle = useMemo(() => {
    if (patientId) return 'Historial del paciente';
    if (doctorId) return 'Agenda del médico';
    return 'Agenda Global';
  }, [doctorId, patientId]);

  const contextSubtitle = useMemo(() => {
    const d = new Date(`${selectedDate}T12:00:00`);
    return `Visión general del ${d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
  }, [selectedDate]);

  const ContextIcon = useMemo(() => {
    if (patientId) return History;
    if (doctorId) return CalendarCheck;
    return ClipboardList;
  }, [doctorId, patientId]);

  return (
    <AgendaShell
      mobileBookingOpen={isBookingOpen}
      onMobileToggleBooking={() => setIsBookingOpen((open) => !open)}
      header={
        <AgendaHeader
          isBookingOpen={isBookingOpen}
          onNew={() => {
            setSelectedId(undefined);
            setIsBookingOpen(true);
          }}
        />
      }
      panel={
        isBookingOpen ? (
          <AppointmentContextPanel
            onCloseCreate={() => setIsBookingOpen(false)}
            onDoctor={setDoctorId}
            onPatient={setPatientId}
            onSpecialty={setSpecialtyId}
            selectedDate={selectedDate}
            specialties={specialties.data?.data ?? []}
          />
        ) : null
      }
      sidebar={<AgendaSidebar />}
    >
      <CalendarMonthGrid
        appointmentDates={appointmentDates}
        compact={isBookingOpen}
        selectedDate={selectedDate}
        onNavigateMonth={navigateMonth}
        onSelectDate={(date) => {
          setSelectedDate(date);
        }}
      />
      {calendar.error ? (
        <div className="mb-6">
          <StatusMessage kind="alert" message={calendar.error.message} />
        </div>
      ) : null}
      <AppointmentList
        ContextIcon={ContextIcon}
        contextSubtitle={contextSubtitle}
        contextTitle={contextTitle}
        document={selectedDayDocument}
        isLoading={calendar.isLoading}
        showContact={false}
        onSelect={setSelectedId}
      />
      <AppointmentDetailPanel appointmentId={selectedId} />
    </AgendaShell>
  );
}

function getMonthRange(date: string) {
  const value = new Date(`${date}T00:00:00`);
  const year = value.getFullYear();
  const month = value.getMonth();
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0);

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
