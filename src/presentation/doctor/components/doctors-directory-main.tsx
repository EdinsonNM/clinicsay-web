import type { ComponentProps } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { AppointmentListDocument } from '../../../domains/appointment/models/appointment.model';
import type { DoctorDetail } from '../../../domains/doctor/models/doctor-detail.model';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { DoctorAdminFormPanel } from './doctor-admin-form-panel';
import { DoctorDetailPanel } from './doctor-detail-panel';
import { DoctorDirectoryCard } from './doctor-directory-card';

export type DoctorFormPanelProps = ComponentProps<typeof DoctorAdminFormPanel>;

export function DoctorsDirectoryMain({
  filtered,
  selectedDoctorId,
  editingInDetailContext,
  selectedSummary,
  specialtyCompactForCard,
  specialtyLineForCard,
  cmpLineForCard,
  onSelectDoctor,
  onClearSelection,
  onEditDoctor,
  onDeleteDoctor,
  detail,
  isDetailLoading,
  detailError,
  appointmentsDoc,
  isAppointmentsLoading,
  appointmentsError,
  onEditFromDetail,
  onDeleteFromDetail,
  doctorFormProps,
}: {
  filtered: Doctor[];
  selectedDoctorId: string | null;
  editingInDetailContext: boolean;
  selectedSummary: Doctor | undefined;
  specialtyCompactForCard: (doctor: Doctor) => string;
  specialtyLineForCard: (doctor: Doctor) => string;
  cmpLineForCard: (doctor: Doctor) => string;
  onSelectDoctor: (id: string) => void;
  onClearSelection: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctor: Doctor) => void;
  detail: DoctorDetail | undefined;
  isDetailLoading: boolean;
  detailError: Error | null;
  appointmentsDoc: AppointmentListDocument | undefined;
  isAppointmentsLoading: boolean;
  appointmentsError: Error | null;
  onEditFromDetail: () => void;
  onDeleteFromDetail: () => void;
  doctorFormProps: DoctorFormPanelProps;
}) {
  const listContainerClassName =
    selectedDoctorId === null
      ? 'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
      : editingInDetailContext
        ? 'hidden'
        : 'hidden w-full shrink-0 space-y-4 lg:block lg:w-[300px] xl:w-[340px]';

  const rootClassName =
    selectedDoctorId !== null
      ? 'flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'
      : 'flex flex-col';

  return (
    <div className={rootClassName}>
      <div className={listContainerClassName}>
        {filtered.map((doctor, index) => (
          <DoctorDirectoryCard
            key={doctor.id}
            doctor={doctor}
            index={index}
            selected={selectedDoctorId === doctor.id}
            specialtyCompactLine={specialtyCompactForCard(doctor)}
            specialtiesAriaDescription={specialtyLineForCard(doctor)}
            cmpLine={cmpLineForCard(doctor)}
            onSelect={() => onSelectDoctor(doctor.id)}
            onEdit={() => onEditDoctor(doctor)}
            onDelete={() => onDeleteDoctor(doctor)}
          />
        ))}
      </div>

      <div className={selectedDoctorId ? 'min-w-0 flex-1' : 'hidden'}>
        {selectedDoctorId && selectedSummary ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black tracking-widest text-slate-600 uppercase shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver al directorio
            </button>
            <DoctorDetailPanel
              summary={selectedSummary}
              detail={detail}
              isDetailLoading={isDetailLoading}
              detailError={detailError}
              appointmentsDoc={appointmentsDoc}
              isAppointmentsLoading={isAppointmentsLoading}
              appointmentsError={appointmentsError}
              specialtyLabelFallback={specialtyLineForCard(selectedSummary)}
              onClose={onClearSelection}
              onEdit={onEditFromDetail}
              onDelete={onDeleteFromDetail}
            />
          </div>
        ) : null}
      </div>

      {editingInDetailContext ? (
        <div className="hidden min-w-0 shrink-0 lg:block lg:w-[min(100%,420px)] xl:w-[440px]">
          <DoctorAdminFormPanel {...doctorFormProps} layout="embedded" />
        </div>
      ) : null}
    </div>
  );
}
