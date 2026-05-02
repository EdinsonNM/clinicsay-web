export function DoctorsDirectoryLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-[#76a5af]/20 border-t-[#76a5af]"
        aria-hidden
      />
      <p className="text-sm font-semibold text-[#90a4ae]">Cargando médicos…</p>
    </div>
  );
}
