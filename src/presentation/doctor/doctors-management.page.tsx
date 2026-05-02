import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { formatIsoDate } from '../../core/date/date-utils';
import type { Doctor } from '../../domains/doctor/models/doctor.model';
import type { DoctorFormInput } from '../../domains/doctor/schemas/doctor-form.schema';
import { useAppointmentsCalendar } from '../../infra/appointment/hooks/use-appointments-calendar';
import { useDoctorCreate } from '../../infra/doctor/hooks/use-doctor-create';
import { useDoctorDelete } from '../../infra/doctor/hooks/use-doctor-delete';
import { useDoctorDetail } from '../../infra/doctor/hooks/use-doctor-detail';
import { useDoctorsList } from '../../infra/doctor/hooks/use-doctors-list';
import { useDoctorUpdate } from '../../infra/doctor/hooks/use-doctor-update';
import { useSpecialtiesGetAll } from '../../infra/specialty/hooks/use-specialties-get-all';
import { AgendaShell } from '../calendar/components/agenda-shell';
import { useMediaQuery } from '../hooks/use-media-query';
import { DoctorAdminFormPanel } from './components/doctor-admin-form-panel';
import { DoctorDeleteConfirmDialog } from './components/doctor-delete-confirm-dialog';
import { DoctorsDirectoryEmpty } from './components/doctors-directory-empty';
import { DoctorsDirectoryError } from './components/doctors-directory-error';
import { DoctorsDirectoryHeader } from './components/doctors-directory-header';
import { DoctorsDirectoryLoading } from './components/doctors-directory-loading';
import { DoctorsDirectoryMain } from './components/doctors-directory-main';

export function DoctorsManagementPage({ sidebar }: { sidebar: ReactNode }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [search, setSearch] = useState('');

  const doctors = useDoctorsList();
  const doctorDetail = useDoctorDetail(selectedDoctorId ?? undefined);
  const specialties = useSpecialtiesGetAll();
  const create = useDoctorCreate();
  const update = useDoctorUpdate();
  const remove = useDoctorDelete();

  const todayIso = useMemo(() => formatIsoDate(new Date()), []);

  const embeddedTodayAppointments = doctorDetail.data?.todayAppointmentsFromDetail;
  const needsAppointmentCalendarFallback =
    Boolean(selectedDoctorId) &&
    (doctorDetail.isError ||
      (doctorDetail.isSuccess && embeddedTodayAppointments === undefined));

  const doctorDayAppointments = useAppointmentsCalendar(
    {
      filters: {
        date: todayIso,
        doctorId: selectedDoctorId ?? '',
      },
      projection: {
        include: ['patient'],
        fields: {
          appointments: ['date', 'status', 'reason'],
          patients: ['fullName'],
        },
      },
    },
    { enabled: needsAppointmentCalendarFallback },
  );

  const appointmentsDoc =
    embeddedTodayAppointments !== undefined ? embeddedTodayAppointments : doctorDayAppointments.data;
  const isAppointmentsLoading =
    doctorDetail.isLoading ||
    (needsAppointmentCalendarFallback && doctorDayAppointments.isLoading);
  const appointmentsError =
    embeddedTodayAppointments !== undefined
      ? null
      : doctorDayAppointments.error instanceof Error
        ? doctorDayAppointments.error
        : null;

  const specialtyById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of specialties.data?.data ?? []) map.set(s.id, s.name);
    return map;
  }, [specialties.data?.data]);

  const filtered = useMemo(() => {
    const list = doctors.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) => {
      if (d.name.toLowerCase().includes(q) || d.cmp.toLowerCase().includes(q)) return true;
      return d.specialtyIds.some((sid) =>
        (specialtyById.get(sid) ?? '').toLowerCase().includes(q),
      );
    });
  }, [doctors.data, search, specialtyById]);

  const selectedSummary = useMemo(
    () => filtered.find((d) => d.id === selectedDoctorId) ?? doctors.data?.find((d) => d.id === selectedDoctorId),
    [filtered, doctors.data, selectedDoctorId],
  );

  /** Lista completa para detalle, aria-label y búsqueda. */
  const specialtyLineForCard = useCallback(
    (doctor: Doctor) => {
      if (doctor.specialtyIds.length === 0) return 'Sin especialidad';
      return doctor.specialtyIds.map((id) => specialtyById.get(id) ?? id).join(' · ');
    },
    [specialtyById],
  );

  /** Solo primera especialidad en tarjeta; si hay más, +1 o 3+. */
  const specialtyCompactForCard = useCallback(
    (doctor: Doctor) => {
      if (doctor.specialtyIds.length === 0) return 'Sin especialidad';
      const firstId = doctor.specialtyIds[0];
      const first = specialtyById.get(firstId ?? '') ?? firstId ?? '';
      const n = doctor.specialtyIds.length;
      if (n === 1) return first;
      if (n === 2) return `${first} · +1`;
      return `${first} · 3+`;
    },
    [specialtyById],
  );

  const cmpLineForCard = useCallback((doctor: Doctor) => doctor.cmp.trim() || '—', []);

  const closeFormPanel = useCallback(() => {
    setPanelOpen(false);
    setEditingDoctor(null);
    create.reset();
    update.reset();
  }, [create, update]);

  const toggleMobileForm = useCallback(() => {
    if (panelOpen) {
      closeFormPanel();
      return;
    }
    setEditingDoctor(null);
    setPanelOpen(true);
  }, [closeFormPanel, panelOpen]);

  async function onSubmitValues(values: DoctorFormInput) {
    if (editingDoctor) {
      await update.mutateAsync({ id: editingDoctor.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    closeFormPanel();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    await remove.mutateAsync(id);
    setDeleteTarget(null);
    if (selectedDoctorId === id) setSelectedDoctorId(null);
    if (editingDoctor?.id === id) closeFormPanel();
  }

  const serverError = create.error?.message ?? update.error?.message ?? '';

  const editingFromDetail =
    editingDoctor && doctorDetail.data?.id === editingDoctor.id ? doctorDetail.data : editingDoctor;

  const isLgUp = useMediaQuery('(min-width: 1024px)');
  const editingInDetailContext =
    panelOpen &&
    isLgUp &&
    editingDoctor !== null &&
    selectedDoctorId !== null &&
    editingDoctor.id === selectedDoctorId;
  const showFormInShellAside = panelOpen && !editingInDetailContext;

  const doctorFormProps = {
    specialties: specialties.data?.data ?? [],
    editingDoctor: editingFromDetail,
    onClose: closeFormPanel,
    onSubmitValues,
    isPending: create.isPending || update.isPending,
    serverError,
  };

  return (
    <>
      <AgendaShell
        sidebar={sidebar}
        contentMaxWidthClass="max-w-[1400px]"
        mobileBookingOpen={showFormInShellAside}
        onMobileToggleBooking={toggleMobileForm}
        header={
          <DoctorsDirectoryHeader
            search={search}
            onSearchChange={setSearch}
            onNewDoctor={() => {
              setEditingDoctor(null);
              setPanelOpen(true);
            }}
          />
        }
        panel={showFormInShellAside ? <DoctorAdminFormPanel {...doctorFormProps} /> : null}
      >
        <div className="w-full">
          {doctors.isLoading ? (
            <DoctorsDirectoryLoading />
          ) : doctors.error ? (
            <DoctorsDirectoryError message={doctors.error.message} />
          ) : filtered.length === 0 ? (
            <DoctorsDirectoryEmpty hasSearchQuery={search.trim().length > 0} />
          ) : (
            <DoctorsDirectoryMain
              filtered={filtered}
              selectedDoctorId={selectedDoctorId}
              editingInDetailContext={editingInDetailContext}
              selectedSummary={selectedSummary}
              specialtyCompactForCard={specialtyCompactForCard}
              specialtyLineForCard={specialtyLineForCard}
              cmpLineForCard={cmpLineForCard}
              onSelectDoctor={setSelectedDoctorId}
              onClearSelection={() => setSelectedDoctorId(null)}
              onEditDoctor={(doctor) => {
                setEditingDoctor(doctor);
                setPanelOpen(true);
              }}
              onDeleteDoctor={setDeleteTarget}
              detail={doctorDetail.data}
              isDetailLoading={doctorDetail.isLoading}
              detailError={doctorDetail.error instanceof Error ? doctorDetail.error : null}
              appointmentsDoc={appointmentsDoc}
              isAppointmentsLoading={isAppointmentsLoading}
              appointmentsError={appointmentsError}
              onEditFromDetail={() => {
                const doc = doctorDetail.data ?? selectedSummary;
                if (!doc) return;
                setEditingDoctor(doc);
                setPanelOpen(true);
              }}
              onDeleteFromDetail={() => {
                const doc = doctorDetail.data ?? selectedSummary;
                if (!doc) return;
                setDeleteTarget(doc);
              }}
              doctorFormProps={doctorFormProps}
            />
          )}
        </div>
      </AgendaShell>

      {deleteTarget ? (
        <DoctorDeleteConfirmDialog
          doctor={deleteTarget}
          isDeleting={remove.isPending}
          errorMessage={remove.error?.message}
          onDismiss={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </>
  );
}
