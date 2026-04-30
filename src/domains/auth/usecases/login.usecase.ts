import type { AuthRepository } from '../repositories/auth.repository';
import type { LoginInput } from '../schemas/login.schema';

export class LoginUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(input: LoginInput) {
    return this.repository.login(input);
  }
}
