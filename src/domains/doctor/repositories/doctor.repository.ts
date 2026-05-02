import type { CreateDoctorDto, UpdateDoctorDto } from '../dto/doctor.dto';
import type { DoctorDetail } from '../models/doctor-detail.model';
import type { Doctor } from '../models/doctor.model';

export abstract class DoctorRepository {
  abstract list(filters?: { specialtyId?: string }): Promise<Doctor[]>;
  abstract detail(id: string): Promise<DoctorDetail>;
  abstract create(input: CreateDoctorDto): Promise<Doctor>;
  abstract update(id: string, input: UpdateDoctorDto): Promise<Doctor>;
  abstract delete(id: string): Promise<void>;
}
