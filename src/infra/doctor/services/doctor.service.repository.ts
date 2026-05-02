import { apiClient } from '../../../core/http/api-client';
import type { CreateDoctorDto, UpdateDoctorDto } from '../../../domains/doctor/dto/doctor.dto';
import type { DoctorDetail } from '../../../domains/doctor/models/doctor-detail.model';
import type { Doctor } from '../../../domains/doctor/models/doctor.model';
import { DoctorRepository } from '../../../domains/doctor/repositories/doctor.repository';
import { parseDoctorDetailPayload, parseDoctorListPayload, parseDoctorPayload } from './doctor-api.mapper';

export class DoctorServiceRepository implements DoctorRepository {
  async list(filters?: { specialtyId?: string }): Promise<Doctor[]> {
    const params = new URLSearchParams();
    params.set('include', 'specialties');
    if (filters?.specialtyId !== undefined && filters.specialtyId !== '') {
      params.set('specialtyId', filters.specialtyId);
    }
    const q = `?${params.toString()}`;
    return parseDoctorListPayload(await apiClient.get(`/doctors${q}`));
  }

  async detail(id: string): Promise<DoctorDetail> {
    return parseDoctorDetailPayload(await apiClient.get(`/doctors/${id}`));
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
