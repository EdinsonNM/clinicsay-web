import type { AdminSession } from '../models/admin-session.model';
import type { LoginInput } from '../schemas/login.schema';

export abstract class AuthRepository {
  abstract login(input: LoginInput): Promise<AdminSession>;
}
