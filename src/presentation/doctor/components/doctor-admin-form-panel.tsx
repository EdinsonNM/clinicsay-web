import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { doctorFormSchema, type DoctorFormInput } from '../../../domains/doctor/schemas/doctor-form.schema';
import type { Specialty } from '../../../domains/specialty/models/specialty.model';

export function DoctorAdminFormPanel({
  specialties,
  editingDoctor,
  onClose,
  onSubmitValues,
  isPending,
  serverError,
}: {
  specialties: Specialty[];
  editingDoctor: Doctor | null;
  onClose: () => void;
  onSubmitValues: (values: DoctorFormInput) => Promise<void>;
  isPending: boolean;
  serverError?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DoctorFormInput>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: '',
      cmp: '',
      specialtyIds: [],
    },
  });

  const specialtyIds = watch('specialtyIds');

  useEffect(() => {
    if (editingDoctor) {
      reset({
        name: editingDoctor.name,
        cmp: editingDoctor.cmp,
        specialtyIds: [...editingDoctor.specialtyIds],
      });
    } else {
      reset({ name: '', cmp: '', specialtyIds: [] });
    }
  }, [editingDoctor, reset]);

  function toggleSpecialty(id: string) {
    const next = specialtyIds.includes(id)
      ? specialtyIds.filter((x) => x !== id)
      : [...specialtyIds, id];
    setValue('specialtyIds', next, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <aside
      className="flex h-full flex-col overflow-hidden rounded-l-[2rem] border-l border-slate-100/80 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] lg:rounded-none lg:p-10"
      aria-label={editingDoctor ? 'Editar médico' : 'Nuevo médico'}
    >
      <div className="mb-8 flex shrink-0 items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#2c3e50]">
            {editingDoctor ? 'Editar médico' : 'Nuevo médico'}
          </h2>
          <p className="mt-1 text-xs font-medium text-[#90a4ae]">
            Complete los datos y marque una o más especialidades.
          </p>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto"
        onSubmit={(e) => void handleSubmit(async (values) => onSubmitValues(values))(e)}
        noValidate
      >
        {serverError ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm font-medium text-amber-950"
          >
            {serverError}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="doctor-name" className="text-[11px] font-bold tracking-widest text-[#90a4ae] uppercase">
            Nombre completo
          </label>
          <input
            id="doctor-name"
            {...register('name')}
            autoComplete="name"
            placeholder="Ej. Dr. Mendoza"
            className="w-full rounded-2xl border border-slate-100 bg-[#f8fbfc] px-4 py-3.5 text-sm font-medium text-[#2c3e50] shadow-inner outline-none transition-all placeholder:text-slate-300 focus:border-[#76a5af]/40 focus:bg-white focus:ring-4 focus:ring-[#76a5af]/10"
          />
          {errors.name ? <p className="text-xs font-medium text-rose-600">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="doctor-cmp" className="text-[11px] font-bold tracking-widest text-[#90a4ae] uppercase">
            CMP
          </label>
          <input
            id="doctor-cmp"
            {...register('cmp')}
            placeholder="Ej. CMP999"
            className="w-full rounded-2xl border border-slate-100 bg-[#f8fbfc] px-4 py-3.5 text-sm font-medium text-[#2c3e50] shadow-inner outline-none transition-all placeholder:text-slate-300 focus:border-[#76a5af]/40 focus:bg-white focus:ring-4 focus:ring-[#76a5af]/10"
          />
          {errors.cmp ? <p className="text-xs font-medium text-rose-600">{errors.cmp.message}</p> : null}
        </div>

        <fieldset className="space-y-3">
          <legend className="text-[11px] font-bold tracking-widest text-[#90a4ae] uppercase">
            Especialidades
          </legend>
          <ul className="max-h-52 space-y-2 overflow-y-auto rounded-2xl border border-slate-100 bg-[#f8fbfc] p-3">
            {specialties.map((s) => {
              const checked = specialtyIds.includes(s.id);
              return (
                <li key={s.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSpecialty(s.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[#76a5af] focus:ring-[#76a5af]"
                    />
                    <span className="text-sm font-medium text-[#2c3e50]">{s.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {errors.specialtyIds ? (
            <p className="text-xs font-medium text-rose-600">{errors.specialtyIds.message}</p>
          ) : null}
        </fieldset>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-[#76a5af] py-4 text-xs font-black tracking-[0.2em] text-white uppercase shadow-[0_12px_28px_rgba(118,165,175,0.35)] transition-all hover:bg-[#6a98a2] active:scale-[0.99] disabled:bg-slate-300"
          >
            {isPending ? 'Guardando…' : editingDoctor ? 'Guardar cambios' : 'Crear médico'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border-2 border-[#76a5af]/35 bg-white py-3.5 text-xs font-black tracking-[0.2em] text-[#76a5af] uppercase transition-all hover:bg-[#f0f7f8]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </aside>
  );
}
