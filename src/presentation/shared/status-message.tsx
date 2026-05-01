export function StatusMessage({
  message,
  kind = 'alert',
}: {
  message: string;
  kind?: 'alert' | 'success';
}) {
  return (
    <div className={`alert compact ${kind === 'success' ? 'success' : ''}`}>
      {message}
    </div>
  );
}
