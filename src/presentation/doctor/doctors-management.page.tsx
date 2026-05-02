import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Search, Stethoscope, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { Doctor } from '../../domains/doctor/models/doctor.model';
import type { DoctorFormInput } from '../../domains/doctor/schemas/doctor-form.schema';
import { useDoctorCreate } from '../../infra/doctor/hooks/use-doctor-create';
import { useDoctorDelete } from '../../infra/doctor/hooks/use-doctor-delete';
import { useDoctorsList } from '../../infra/doctor/hooks/use-doctors-list';
import { useDoctorUpdate } from '../../infra/doctor/hooks/use-doctor-update';
import { useSpecialtiesGetAll } from '../../infra/specialty/hooks/use-specialties-get-all';
import { AgendaShell } from '../calendar/components/agenda-shell';
import { DoctorAdminFormPanel } from './components/doctor-admin-form-panel';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function DoctorsManagementPage({ sidebar }: { sidebar: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [search, setSearch] = useState('');

  const doctors = useDoctorsList();
  const specialties = useSpecialtiesGetAll();
  const create = useDoctorCreate();
  const update = useDoctorUpdate();
  const remove = useDoctorDelete();

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

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setEditingDoctor(null);
    create.reset();
    update.reset();
  }, [create, update]);

  const toggleMobilePanel = useCallback(() => {
    if (panelOpen) {
      closePanel();
      return;
    }
    setEditingDoctor(null);
    setPanelOpen(true);
  }, [closePanel, panelOpen]);

  async function onSubmitValues(values: DoctorFormInput) {
    if (editingDoctor) {
      await update.mutateAsync({ id: editingDoctor.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    closePanel();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    await remove.mutateAsync(id);
    setDeleteTarget(null);
    if (editingDoctor?.id === id) closePanel();
  }

  const serverError = create.error?.message ?? update.error?.message ?? '';

  return (
    <>
      <AgendaShell
        sidebar={sidebar}
        mobileBookingOpen={panelOpen}
        onMobileToggleBooking={toggleMobilePanel}
        header={
          <header className="mb-8 flex shrink-0 flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl leading-tight font-black tracking-tight text-[#2c3e50]">
                Equipo médico
              </h1>
              <p className="mt-1 text-xs font-bold tracking-[0.2em] text-[#90a4ae] uppercase">
                Alta, edición y baja de médicos
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-[200px] flex-1 md:max-w-xs">
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#90a4ae]"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar médico"
                  placeholder="Buscar por nombre, CMP o especialidad…"
                  className="focus:ring-[#76a5af]/10 w-full rounded-2xl border border-transparent bg-white py-3 pr-4 pl-11 text-sm font-medium text-[#2c3e50] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition-all focus:border-[#76a5af]/30 focus:ring-8"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingDoctor(null);
                  setPanelOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#76a5af] px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-[0_12px_28px_rgba(118,165,175,0.35)] transition-all hover:bg-[#6a98a2] active:scale-95"
              >
                <Plus className="h-5 w-5" aria-hidden />
                Nuevo médico
              </button>
            </div>
          </header>
        }
        panel={
          panelOpen ? (
            <DoctorAdminFormPanel
              specialties={specialties.data?.data ?? []}
              editingDoctor={editingDoctor}
              onClose={closePanel}
              onSubmitValues={onSubmitValues}
              isPending={create.isPending || update.isPending}
              serverError={serverError}
            />
          ) : null
        }
      >
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-10">
          {doctors.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-[#76a5af]/20 border-t-[#76a5af]"
                aria-hidden
              />
              <p className="text-sm font-semibold text-[#90a4ae]">Cargando médicos…</p>
            </div>
          ) : doctors.error ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-900"
            >
              {doctors.error.message}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f7f8] text-[#76a5af]">
                <Stethoscope className="h-10 w-10" aria-hidden />
              </div>
              <p className="max-w-sm text-base font-bold text-[#2c3e50]">
                {search.trim() ? 'No hay resultados para tu búsqueda' : 'Aún no hay médicos registrados'}
              </p>
              <p className="max-w-xs text-sm font-medium text-[#90a4ae]">
                Usa &quot;Nuevo médico&quot; para dar de alta al equipo.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((doctor, index) => (
                <motion.li
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28, delay: index * 0.03 }}
                >
                  <article className="group flex h-full flex-col rounded-[1.75rem] border border-slate-50 bg-[#fafcfd] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#76a5af]/20 hover:shadow-[0_16px_40px_rgba(118,165,175,0.12)]">
                    <div className="flex gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#76a5af] to-[#5d8a93] text-sm font-black text-white shadow-md shadow-[#76a5af]/25"
                        aria-hidden
                      >
                        {initials(doctor.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-[#2c3e50]">{doctor.name}</h3>
                        <p className="mt-0.5 text-xs font-semibold tracking-wide text-[#90a4ae] uppercase">
                          CMP {doctor.cmp}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm font-medium text-[#76a5af]">
                          {doctor.specialtyIds.length > 0
                            ? doctor.specialtyIds
                                .map((id) => specialtyById.get(id) ?? id)
                                .join(' · ')
                            : 'Sin especialidad'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100/80 pt-4">
                      <button
                        type="button"
                        className="text-xs font-black tracking-widest text-[#76a5af] uppercase transition-colors hover:text-[#5d8a93]"
                        onClick={() => {
                          setEditingDoctor(doctor);
                          setPanelOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Editar ${doctor.name}`}
                          className="rounded-xl p-2 text-[#90a4ae] transition-colors hover:bg-white hover:text-[#76a5af]"
                          onClick={() => {
                            setEditingDoctor(doctor);
                            setPanelOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar ${doctor.name}`}
                          className="rounded-xl p-2 text-[#90a4ae] transition-colors hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setDeleteTarget(doctor)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </article>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </AgendaShell>

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2c3e50]/40 p-6 backdrop-blur-sm"
          role="presentation"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-doctor-title"
            className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-doctor-title" className="text-lg font-bold text-[#2c3e50]">
              ¿Eliminar médico?
            </h2>
            <p className="mt-3 text-sm leading-relaxed font-medium text-[#90a4ae]">
              Se quitará <span className="font-bold text-[#2c3e50]">{deleteTarget.name}</span> del directorio.
              Las citas existentes pueden verse afectadas según la configuración del servidor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
              <button
                type="button"
                disabled={remove.isPending}
                onClick={() => void confirmDelete()}
                className="rounded-2xl bg-rose-500 px-6 py-3.5 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 disabled:bg-slate-300"
              >
                {remove.isPending ? 'Eliminando…' : 'Eliminar'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border-2 border-[#76a5af]/35 bg-white px-6 py-3.5 text-xs font-black tracking-widest text-[#76a5af] uppercase hover:bg-[#f0f7f8]"
              >
                Cancelar
              </button>
            </div>
            {remove.error ? (
              <p className="mt-4 text-sm font-medium text-rose-600" role="alert">
                {remove.error.message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
