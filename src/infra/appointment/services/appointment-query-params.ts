export interface DetailProjection {
  include: string[];
  fields: Partial<Record<'appointments' | 'patients' | 'doctors' | 'specialties', string[]>>;
}

export function buildAppointmentDetailQuery(projection: DetailProjection) {
  const params = new URLSearchParams();
  if (projection.include.length > 0) params.set('include', projection.include.join(','));
  for (const [resource, fields] of Object.entries(projection.fields)) {
    if (fields && fields.length > 0) params.set(`fields[${resource}]`, fields.join(','));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
