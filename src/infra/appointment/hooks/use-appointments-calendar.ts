import { useQuery } from '@tanstack/react-query';
import { ListCalendarUseCase } from '../../../domains/appointment/usecases/list-calendar.usecase';
import { AppointmentServiceRepository } from '../services/appointment.service.repository';

const useCase = new ListCalendarUseCase(new AppointmentServiceRepository());

export function useAppointmentsCalendar(from: string, to: string) {
  return useQuery({
    queryKey: ['appointments-calendar', from, to],
    queryFn: () => useCase.execute({ from, to }),
  });
}
