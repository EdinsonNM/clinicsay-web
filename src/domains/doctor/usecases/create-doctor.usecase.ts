import type { CreateDoctorDto } from '../dto/doctor.dto';
import type { DoctorRepository } from '../repositories/doctor.repository';

export class CreateDoctorUseCase {
  private readonly repository: DoctorRepository;

  constructor(repository: DoctorRepository) {
    this.repository = repository;
  }

  execute(input: CreateDoctorDto) {
    return this.repository.create(input);
  }
}
