import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/http/api-client';
import type { Patient } from '../../../domains/patient/models/patient.model';

export function usePatientsSearch(search: string) {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: () => apiClient.get<{ data: Patient[] }>(`/patients?search=${encodeURIComponent(search)}`),
  });
}
