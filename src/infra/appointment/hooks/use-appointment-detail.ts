import { useQuery } from '@tanstack/react-query';
import { AppointmentServiceRepository } from '../services/appointment.service.repository';
import { buildAppointmentDetailQuery, type DetailProjection } from '../services/appointment-query-params';

const repository = new AppointmentServiceRepository();

export function useAppointmentDetail(id: string | undefined, projection: DetailProjection) {
  const query = buildAppointmentDetailQuery(projection);
  return useQuery({
    queryKey: ['appointment-detail', id, query],
    queryFn: () => repository.detail(id!, query),
    enabled: Boolean(id),
  });
}
