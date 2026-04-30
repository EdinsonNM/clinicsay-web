import { apiClient } from '../../../core/http/api-client';
import type { AdminSession } from '../../../domains/auth/models/admin-session.model';
import { AuthRepository } from '../../../domains/auth/repositories/auth.repository';
import type { LoginInput } from '../../../domains/auth/schemas/login.schema';

export class AuthServiceRepository implements AuthRepository {
  login(input: LoginInput): Promise<AdminSession> {
    return apiClient.post<AdminSession>('/auth/login', input);
  }
}
