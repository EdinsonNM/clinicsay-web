import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateDoctorDto } from '../../../domains/doctor/dto/doctor.dto';
import { CreateDoctorUseCase } from '../../../domains/doctor/usecases/create-doctor.usecase';
import { DoctorServiceRepository } from '../services/doctor.service.repository';

const createDoctorUseCase = new CreateDoctorUseCase(new DoctorServiceRepository());

export function useDoctorCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDoctorDto) => createDoctorUseCase.execute(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
