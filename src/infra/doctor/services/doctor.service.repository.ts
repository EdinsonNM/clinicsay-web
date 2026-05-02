import { apiClient } from '../../../core/http/api-client';
import type { CreateDoctorDto, UpdateDoctorDto } from '../../../domains/doctor/dto/doctor.dto';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { DoctorRepository } from '../../../domains/doctor/repositories/doctor.repository';
import { parseDoctorListPayload, parseDoctorPayload } from './doctor-api.mapper';

export class DoctorServiceRepository implements DoctorRepository {
  async list(filters?: { specialtyId?: string }): Promise<Doctor[]> {
    const q =
      filters?.specialtyId !== undefined && filters.specialtyId !== ''
        ? `?specialtyId=${encodeURIComponent(filters.specialtyId)}`
        : '';
    return parseDoctorListPayload(await apiClient.get(`/doctors${q}`));
  }

  async create(input: CreateDoctorDto): Promise<Doctor> {
    return parseDoctorPayload(await apiClient.post('/doctors', input));
  }

  async update(id: string, input: UpdateDoctorDto): Promise<Doctor> {
    return parseDoctorPayload(await apiClient.patch(`/doctors/${id}`, input));
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/doctors/${id}`);
  }
}
