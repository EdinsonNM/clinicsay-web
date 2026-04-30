export function StatusMessage({ message, kind = 'alert' }: { message: string; kind?: 'alert' | 'success' }) {
  return <div className={`alert ${kind === 'success' ? 'success' : ''}`}>{message}</div>;
}
