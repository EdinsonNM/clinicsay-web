export function DoctorsDirectoryError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-900"
    >
      {message}
    </div>
  );
}
