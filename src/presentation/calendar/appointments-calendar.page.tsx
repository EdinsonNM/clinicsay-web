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
      ...(specialtyId ? { specialtyId } : {}),
    }),
    [doctorId, monthRange.from, monthRange.to, specialtyId],
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
  const patientHistory = useAppointmentsCalendar(
    {
      filters: { patientId },
      projection,
    },
    { enabled: Boolean(patientId) },
  );
  const doctorDayReservations = useAppointmentsCalendar(
    {
      filters: {
        date: selectedDate,
        ...(doctorId ? { doctorId } : {}),
      },
      projection,
    },
    { enabled: Boolean(patientId && doctorId) },
  );
  const selectedDayDocument = useMemo(() => {
    if (patientId && patientHistory.data) return patientHistory.data;
    if (!calendar.data) return undefined;
    return {
      ...calendar.data,
      data: calendar.data.data.filter((appointment) =>
        String(appointment.attributes.date ?? '').startsWith(selectedDate),
      ),
    };
  }, [calendar.data, patientHistory.data, patientId, selectedDate]);
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
    if (patientId) return 'Últimas visitas registradas';
    const d = new Date(`${selectedDate}T12:00:00`);
    return `Visión general del ${d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
  }, [patientId, selectedDate]);

  const ContextIcon = useMemo(() => {
    if (patientId) return History;
    if (doctorId) return CalendarCheck;
    return ClipboardList;
  }, [doctorId, patientId]);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    setDoctorId('');
    setPatientId('');
    setSpecialtyId('');
    setSelectedId(undefined);
  }, []);

  const toggleMobileBooking = useCallback(() => {
    if (isBookingOpen) {
      closeBooking();
      return;
    }
    setSelectedId(undefined);
    setIsBookingOpen(true);
  }, [closeBooking, isBookingOpen]);

  return (
    <AgendaShell
      mobileBookingOpen={isBookingOpen}
      onMobileToggleBooking={toggleMobileBooking}
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
            onCloseCreate={closeBooking}
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
        compactBottom={Boolean(patientId && doctorId)}
        document={selectedDayDocument}
        isLoading={patientId ? patientHistory.isLoading : calendar.isLoading}
        showContact={false}
        onSelect={setSelectedId}
      />
      {patientId && doctorId ? (
        <AppointmentList
          ContextIcon={CalendarCheck}
          contextSubtitle={doctorReservationsSubtitle(selectedDate)}
          contextTitle="Reservas del médico"
          document={doctorDayReservations.data}
          isLoading={doctorDayReservations.isLoading}
          showContact={false}
          onSelect={setSelectedId}
        />
      ) : null}
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

function doctorReservationsSubtitle(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `Reservas del ${value.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
}
