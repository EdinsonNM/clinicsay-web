import { describe, expect, it, vi } from 'vitest';
import type { CreateAppointmentDto } from '../dtos/appointment.dto';
import type { AppointmentRepository } from '../repositories/appointment.repository';
import { CreateAppointmentUseCase } from './create-appointment.usecase';

describe('CreateAppointmentUseCase', () => {
  it('execute delega en el repositorio', async () => {
    const create = vi.fn().mockResolvedValue({ ok: true });
    const repository = { create } as unknown as AppointmentRepository;
    const useCase = new CreateAppointmentUseCase(repository);
    const dto = {} as CreateAppointmentDto;
    await expect(useCase.execute(dto)).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith(dto);
  });
});
