import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteDoctorUseCase } from '../../../domains/doctor/usecases/delete-doctor.usecase';
import { DoctorServiceRepository } from '../services/doctor.service.repository';

const deleteDoctorUseCase = new DeleteDoctorUseCase(new DoctorServiceRepository());

export function useDoctorDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoctorUseCase.execute(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
