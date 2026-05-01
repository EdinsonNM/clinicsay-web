import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../core/http/api-client';
import { AuthServiceRepository } from './auth.service.repository';

vi.mock('../../../core/http/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('AuthServiceRepository', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockResolvedValue({
      token: 'tok',
      user: { id: 'u1', role: 'admin', name: 'Admin' },
    });
  });

  it('login usa POST /auth/login', async () => {
    const repo = new AuthServiceRepository();
    const session = await repo.login({ username: 'admin', password: 'secret' });
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: 'secret',
    });
    expect(session.token).toBe('tok');
  });
});
