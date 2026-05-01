import { ArrowLeft, CalendarCheck, ClipboardList, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import {
  formatShortDateEs,
  getMonthRange,
  shiftIsoMonth,
} from '../../core/date/date-utils';
import type {
  AppointmentProjectionRequest,
  AppointmentQueryFilters,
} from '../../domains/appointment/dtos/appointment.dto';
import type { AppointmentListDocument } from '../../domains/appointment/models/appointment.model';
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
  const [isAgendaExpanded, setIsAgendaExpanded] = useState(false);
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
  const selectedAppointmentDocument = useMemo(
    () =>
      selectedId
        ? getSelectedAppointmentDocument(selectedId, [
            selectedDayDocument,
            doctorDayReservations.data,
            calendar.data,
            patientHistory.data,
          ])
        : undefined,
    [
      calendar.data,
      doctorDayReservations.data,
      patientHistory.data,
      selectedDayDocument,
      selectedId,
    ],
  );

  const navigateMonth = useCallback((delta: number) => {
    setSelectedDate(shiftIsoMonth(selectedDate, delta));
  }, [selectedDate]);

  const contextTitle = useMemo(() => {
    if (patientId) return 'Historial del paciente';
    if (doctorId) return 'Agenda del médico';
    return 'Agenda Global';
  }, [doctorId, patientId]);

  const contextSubtitle = useMemo(() => {
    if (patientId) return 'Últimas visitas registradas';
    return `Visión general del ${formatShortDateEs(selectedDate)}`;
  }, [patientId, selectedDate]);

  const ContextIcon = useMemo(() => {
    if (patientId) return History;
    if (doctorId) return CalendarCheck;
    return ClipboardList;
  }, [doctorId, patientId]);
  const isGlobalAgenda = !patientId && !doctorId;

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    setDoctorId('');
    setPatientId('');
    setSpecialtyId('');
    setSelectedId(undefined);
    setIsAgendaExpanded(false);
  }, []);

  const toggleMobileBooking = useCallback(() => {
    if (isBookingOpen) {
      closeBooking();
      return;
    }
    setSelectedId(undefined);
    setIsAgendaExpanded(false);
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
            setIsAgendaExpanded(false);
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
      <AnimatePresence mode="wait" initial={false}>
        {!selectedId && !isAgendaExpanded ? (
          <motion.div
            key="agenda-main"
            layout
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -72, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          >
            <motion.div layout transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              <CalendarMonthGrid
                appointmentDates={appointmentDates}
                compact={isBookingOpen}
                selectedDate={selectedDate}
                onNavigateMonth={navigateMonth}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedId(undefined);
                  setIsAgendaExpanded(false);
                }}
              />
            </motion.div>
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
              visibleLimit={isGlobalAgenda ? 5 : undefined}
              showContact={false}
              onViewMore={isGlobalAgenda ? () => setIsAgendaExpanded(true) : undefined}
              onSelect={setSelectedId}
            />
            {patientId && doctorId ? (
              <AppointmentList
                ContextIcon={CalendarCheck}
                contextSubtitle={`Reservas del ${formatShortDateEs(selectedDate)}`}
                contextTitle="Reservas del médico"
                document={doctorDayReservations.data}
                isLoading={doctorDayReservations.isLoading}
                showContact={false}
                onSelect={setSelectedId}
              />
            ) : null}
          </motion.div>
        ) : isAgendaExpanded ? (
          <motion.div
            key="agenda-expanded"
            layout
            initial={{ opacity: 0, y: 42, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          >
            <div className="mb-6 flex justify-end px-4">
              <button
                type="button"
                onClick={() => setIsAgendaExpanded(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2 text-xs font-black tracking-widest text-slate-500 uppercase shadow-sm transition-all hover:border-teal-100 hover:bg-teal-50 hover:text-teal-700"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Regresar
              </button>
            </div>
            <AppointmentList
              ContextIcon={ClipboardList}
              contextSubtitle={`Total de citas del ${formatShortDateEs(selectedDate)}`}
              contextTitle="Agenda global completa"
              document={selectedDayDocument}
              isLoading={calendar.isLoading}
              showContact={false}
              onSelect={(id) => {
                setIsAgendaExpanded(false);
                setSelectedId(id);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="appointment-focus"
            layout
            initial={{ opacity: 0, y: 42, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          >
            <AppointmentList
              ContextIcon={ClipboardList}
              compactBottom
              contextSubtitle="Vista enfocada de la cita seleccionada"
              contextTitle="Cita seleccionada"
              document={selectedAppointmentDocument}
              isLoading={false}
              selectedId={selectedId}
              showContact={false}
              onSelect={setSelectedId}
            />
            <AppointmentDetailPanel
              appointmentId={selectedId}
              onBack={() => setSelectedId(undefined)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AgendaShell>
  );
}

function getSelectedAppointmentDocument(
  selectedId: string,
  documents: Array<AppointmentListDocument | undefined>,
): AppointmentListDocument | undefined {
  const document = documents.find((item) =>
    item?.data.some((appointment) => appointment.id === selectedId),
  );
  const appointment = document?.data.find((item) => item.id === selectedId);

  if (!document || !appointment) return undefined;

  return {
    ...document,
    data: [appointment],
  };
}
