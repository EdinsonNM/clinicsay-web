import type { CreateAppointmentDto } from '../dtos/appointment.dto';
import type { AppointmentRepository } from '../repositories/appointment.repository';

export class CreateAppointmentUseCase {
  private readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  execute(input: CreateAppointmentDto) {
    return this.repository.create(input);
  }
}
