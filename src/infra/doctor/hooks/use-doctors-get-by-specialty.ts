import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/http/api-client';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';

export function useDoctorsGetBySpecialty(specialtyId: string) {
  return useQuery({
    queryKey: ['doctors', specialtyId],
    queryFn: () => apiClient.get<{ data: Doctor[] }>(`/doctors?specialtyId=${specialtyId}`),
    enabled: Boolean(specialtyId),
  });
}
