import type {
  AppointmentProjectionRequest,
  AppointmentQueryFilters,
} from '../../../domains/appointment/dtos/appointment.dto';

export type DetailProjection = AppointmentProjectionRequest;

export function buildAppointmentDetailQuery(projection: DetailProjection) {
  return buildAppointmentQuery({ projection });
}

export function buildAppointmentQuery(input: {
  filters?: AppointmentQueryFilters;
  projection?: AppointmentProjectionRequest;
}) {
  const params = new URLSearchParams();
  const filters = input.filters ?? {};
  const projection = input.projection ?? { include: [], fields: {} };
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  if (projection.include.length > 0) params.set('include', projection.include.join(','));
  for (const [resource, fields] of Object.entries(projection.fields)) {
    if (fields && fields.length > 0) params.set(`fields[${resource}]`, fields.join(','));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
