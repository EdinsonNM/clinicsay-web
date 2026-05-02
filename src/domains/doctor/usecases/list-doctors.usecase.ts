import type { DoctorRepository } from '../repositories/doctor.repository';

export class ListDoctorsUseCase {
  private readonly repository: DoctorRepository;

  constructor(repository: DoctorRepository) {
    this.repository = repository;
  }

  execute(filters?: { specialtyId?: string }) {
    return this.repository.list(filters);
  }
}
