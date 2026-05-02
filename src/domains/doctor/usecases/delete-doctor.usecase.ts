import type { DoctorRepository } from '../repositories/doctor.repository';

export class DeleteDoctorUseCase {
  private readonly repository: DoctorRepository;

  constructor(repository: DoctorRepository) {
    this.repository = repository;
  }

  execute(id: string) {
    return this.repository.delete(id);
  }
}
