import { useMutation } from '@tanstack/react-query';
import type { LoginInput } from '../../../domains/auth/schemas/login.schema';
import { LoginUseCase } from '../../../domains/auth/usecases/login.usecase';
import { AuthServiceRepository } from '../services/auth.service.repository';

const useCase = new LoginUseCase(new AuthServiceRepository());

export function useAuthLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => useCase.execute(input),
  });
}
