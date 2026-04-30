import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateAppointmentDto } from '../../../domains/appointment/dtos/appointment.dto';
import { CreateAppointmentUseCase } from '../../../domains/appointment/usecases/create-appointment.usecase';
import { AppointmentServiceRepository } from '../services/appointment.service.repository';

const useCase = new CreateAppointmentUseCase(new AppointmentServiceRepository());

export function useAppointmentCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentDto) => useCase.execute(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments-calendar'] }),
  });
}
