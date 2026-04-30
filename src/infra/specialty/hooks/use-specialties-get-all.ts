import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/http/api-client';
import type { Specialty } from '../../../domains/specialty/models/specialty.model';

export function useSpecialtiesGetAll() {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: () => apiClient.get<{ data: Specialty[] }>('/specialties'),
  });
}
