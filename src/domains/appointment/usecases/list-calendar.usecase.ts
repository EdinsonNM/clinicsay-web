import type { CalendarQueryDto } from '../dtos/appointment.dto';
import type { AppointmentRepository } from '../repositories/appointment.repository';

export class ListCalendarUseCase {
  private readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  execute(query: CalendarQueryDto) {
    return this.repository.listCalendar(query);
  }
}
