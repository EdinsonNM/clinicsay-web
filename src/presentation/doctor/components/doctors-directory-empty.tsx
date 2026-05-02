import { Stethoscope } from 'lucide-react';

export function DoctorsDirectoryEmpty({ hasSearchQuery }: { hasSearchQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f7f8] text-[#76a5af]">
        <Stethoscope className="h-10 w-10" aria-hidden />
      </div>
      <p className="max-w-sm text-base font-bold text-[#2c3e50]">
        {hasSearchQuery ? 'No hay resultados para tu búsqueda' : 'Aún no hay médicos registrados'}
      </p>
      <p className="max-w-xs text-sm font-medium text-[#90a4ae]">
        Usa &quot;Nuevo médico&quot; para dar de alta al equipo.
      </p>
    </div>
  );
}
