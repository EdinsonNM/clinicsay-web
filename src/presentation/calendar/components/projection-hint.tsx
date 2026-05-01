export function ProjectionHint({ query }: { query: string }) {
  return (
    <p className="projection-hint" aria-label="Peticion generada">
      GET /appointments{query || '?'}
    </p>
  );
}
