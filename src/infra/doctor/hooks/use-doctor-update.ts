import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateDoctorDto } from '../../../domains/doctor/dto/doctor.dto';
import { UpdateDoctorUseCase } from '../../../domains/doctor/usecases/update-doctor.usecase';
import { DoctorServiceRepository } from '../services/doctor.service.repository';

const updateDoctorUseCase = new UpdateDoctorUseCase(new DoctorServiceRepository());

export function useDoctorUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDoctorDto }) =>
      updateDoctorUseCase.execute(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
