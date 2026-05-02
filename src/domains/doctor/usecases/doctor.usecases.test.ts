import { describe, expect, it, vi } from 'vitest';
import type { CreateDoctorDto } from '../dto/doctor.dto';
import type { DoctorRepository } from '../repositories/doctor.repository';
import { CreateDoctorUseCase } from './create-doctor.usecase';
import { DeleteDoctorUseCase } from './delete-doctor.usecase';
import { ListDoctorsUseCase } from './list-doctors.usecase';
import { UpdateDoctorUseCase } from './update-doctor.usecase';

describe('Doctor use cases', () => {
  it('ListDoctorsUseCase delega list', async () => {
    const list = vi.fn().mockResolvedValue([]);
    const repository = { list } as unknown as DoctorRepository;
    const useCase = new ListDoctorsUseCase(repository);
    await expect(useCase.execute({ specialtyId: 's1' })).resolves.toEqual([]);
    expect(list).toHaveBeenCalledWith({ specialtyId: 's1' });
  });

  it('CreateDoctorUseCase delega create', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'd1' });
    const repository = { create } as unknown as DoctorRepository;
    const useCase = new CreateDoctorUseCase(repository);
    const dto = { name: 'A', cmp: 'c', specialtyIds: ['s1'] } satisfies CreateDoctorDto;
    await expect(useCase.execute(dto)).resolves.toEqual({ id: 'd1' });
    expect(create).toHaveBeenCalledWith(dto);
  });

  it('UpdateDoctorUseCase delega update', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'd1' });
    const repository = { update } as unknown as DoctorRepository;
    const useCase = new UpdateDoctorUseCase(repository);
    await expect(useCase.execute('d1', { name: 'B' })).resolves.toEqual({ id: 'd1' });
    expect(update).toHaveBeenCalledWith('d1', { name: 'B' });
  });

  it('DeleteDoctorUseCase delega delete', async () => {
    const deleteFn = vi.fn().mockResolvedValue(undefined);
    const repository = { delete: deleteFn } as unknown as DoctorRepository;
    const useCase = new DeleteDoctorUseCase(repository);
    await expect(useCase.execute('d1')).resolves.toBeUndefined();
    expect(deleteFn).toHaveBeenCalledWith('d1');
  });
});
