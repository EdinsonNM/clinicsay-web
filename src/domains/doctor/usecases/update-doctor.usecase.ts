import type { UpdateDoctorDto } from '../dto/doctor.dto';
import type { DoctorRepository } from '../repositories/doctor.repository';

export class UpdateDoctorUseCase {
  private readonly repository: DoctorRepository;

  constructor(repository: DoctorRepository) {
    this.repository = repository;
  }

  execute(id: string, input: UpdateDoctorDto) {
    return this.repository.update(id, input);
  }
}
