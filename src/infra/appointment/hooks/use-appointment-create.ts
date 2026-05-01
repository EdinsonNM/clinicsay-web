import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateAppointmentDto } from '../../../domains/appointment/dtos/appointment.dto';
import { CreateAppointmentUseCase } from '../../../domains/appointment/usecases/create-appointment.usecase';
import { AppointmentServiceRepository } from '../services/appointment.service.repository';

const useCase = new CreateAppointmentUseCase(new AppointmentServiceRepository());

export function useAppointmentCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentDto) => useCase.execute(input),
    onSuccess: async (_data, input) => {
      await queryClient.invalidateQueries({ queryKey: ['appointments-calendar'] });
      if (input.patient) {
        await queryClient.invalidateQueries({ queryKey: ['patients'] });
      }
    },
  });
}
