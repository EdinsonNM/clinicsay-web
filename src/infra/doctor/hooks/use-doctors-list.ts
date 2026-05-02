import { useQuery } from '@tanstack/react-query';
import { ListDoctorsUseCase } from '../../../domains/doctor/usecases/list-doctors.usecase';
import { DoctorServiceRepository } from '../services/doctor.service.repository';

const listDoctorsUseCase = new ListDoctorsUseCase(new DoctorServiceRepository());

export function useDoctorsList() {
  return useQuery({
    queryKey: ['doctors', 'list'],
    queryFn: () => listDoctorsUseCase.execute(),
  });
}
