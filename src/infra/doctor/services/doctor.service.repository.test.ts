import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../core/http/api-client';
import { DoctorServiceRepository } from './doctor.service.repository';

vi.mock('../../../core/http/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('DoctorServiceRepository', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.patch).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('list sin filtro hace GET /doctors', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ id: 'd1', name: 'Dr. A', cmp: 'c1', specialtyIds: ['s1'] }],
    });
    const repo = new DoctorServiceRepository();
    const rows = await repo.list();
    expect(apiClient.get).toHaveBeenCalledWith('/doctors?include=specialties');
    expect(rows).toHaveLength(1);
    expect(rows[0].specialtyIds).toEqual(['s1']);
  });

  it('list con specialtyId añade query', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
    const repo = new DoctorServiceRepository();
    await repo.list({ specialtyId: 's-1' });
    expect(apiClient.get).toHaveBeenCalledWith('/doctors?include=specialties&specialtyId=s-1');
  });

  it('create hace POST /doctors', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { id: 'd1', name: 'Dr. Mendoza', cmp: 'CMP999', specialtyIds: ['s-1'] },
    });
    const repo = new DoctorServiceRepository();
    const created = await repo.create({
      name: 'Dr. Mendoza',
      cmp: 'CMP999',
      specialtyIds: ['s-1'],
    });
    expect(apiClient.post).toHaveBeenCalledWith('/doctors', {
      name: 'Dr. Mendoza',
      cmp: 'CMP999',
      specialtyIds: ['s-1'],
    });
    expect(created.id).toBe('d1');
  });

  it('update hace PATCH /doctors/:id', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({
      data: { id: 'd1', name: 'X', cmp: 'c', specialtyIds: ['s1'] },
    });
    const repo = new DoctorServiceRepository();
    await repo.update('d1', { name: 'X' });
    expect(apiClient.patch).toHaveBeenCalledWith('/doctors/d1', { name: 'X' });
  });

  it('delete hace DELETE /doctors/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    const repo = new DoctorServiceRepository();
    await repo.delete('d1');
    expect(apiClient.delete).toHaveBeenCalledWith('/doctors/d1');
  });

  it('detail hace GET /doctors/:id', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        id: 'd1',
        name: 'Dr. X',
        cmp: 'c',
        specialtyIds: ['s1'],
        email: 'x@clinic.test',
        phone: '+51 999',
      },
    });
    const repo = new DoctorServiceRepository();
    const row = await repo.detail('d1');
    expect(apiClient.get).toHaveBeenCalledWith('/doctors/d1');
    expect(row.email).toBe('x@clinic.test');
    expect(row.phone).toBe('+51 999');
  });
});
