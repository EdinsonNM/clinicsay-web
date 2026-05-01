import { useQuery } from '@tanstack/react-query';
import type { CalendarQueryDto } from '../../../domains/appointment/dtos/appointment.dto';
import { ListCalendarUseCase } from '../../../domains/appointment/usecases/list-calendar.usecase';
import { AppointmentServiceRepository } from '../services/appointment.service.repository';

const useCase = new ListCalendarUseCase(new AppointmentServiceRepository());

export function useAppointmentsCalendar(query: CalendarQueryDto) {
  return useQuery({
    queryKey: ['appointments-calendar', query],
    queryFn: () => useCase.execute(query),
  });
}
