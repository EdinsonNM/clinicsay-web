import { useQuery } from '@tanstack/react-query';
import { GetDoctorDetailUseCase } from '../../../domains/doctor/usecases/get-doctor-detail.usecase';
import { DoctorServiceRepository } from '../services/doctor.service.repository';

const getDoctorDetailUseCase = new GetDoctorDetailUseCase(new DoctorServiceRepository());

export function useDoctorDetail(doctorId: string | undefined) {
  return useQuery({
    queryKey: ['doctors', 'detail', doctorId],
    queryFn: () => getDoctorDetailUseCase.execute(doctorId!),
    enabled: Boolean(doctorId),
  });
}
