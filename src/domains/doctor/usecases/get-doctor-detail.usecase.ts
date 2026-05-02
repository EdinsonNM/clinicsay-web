import type { DoctorRepository } from '../repositories/doctor.repository';

export class GetDoctorDetailUseCase {
  private readonly repository: DoctorRepository;

  constructor(repository: DoctorRepository) {
    this.repository = repository;
  }

  execute(id: string) {
    return this.repository.detail(id);
  }
}
