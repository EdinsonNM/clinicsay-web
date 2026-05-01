import { describe, expect, it, vi } from 'vitest';
import type { AuthRepository } from '../repositories/auth.repository';
import type { LoginInput } from '../schemas/login.schema';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  it('execute delega en el repositorio', async () => {
    const login = vi.fn().mockResolvedValue({ token: 'x', user: { id: '1', role: 'admin', name: 'N' } });
    const repository = { login } as unknown as AuthRepository;
    const useCase = new LoginUseCase(repository);
    const input: LoginInput = { username: 'a', password: 'b' };
    await expect(useCase.execute(input)).resolves.toMatchObject({ token: 'x' });
    expect(login).toHaveBeenCalledWith(input);
  });
});
