import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../core/http/api-client';
import { AppointmentServiceRepository } from './appointment.service.repository';

vi.mock('../../../core/http/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const listPayload = {
  data: [
    {
      type: 'appointments' as const,
      id: 'a1',
      attributes: {},
    },
  ],
};

const detailPayload = {
  data: {
    type: 'appointments' as const,
    id: 'a1',
    attributes: {},
  },
};

describe('AppointmentServiceRepository', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
  });

  it('listCalendar pide GET /appointments con query', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(listPayload);
    const repo = new AppointmentServiceRepository();
    const result = await repo.listCalendar({
      filters: { date: '2026-05-01' },
      projection: { include: [], fields: {} },
    });
    expect(apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/^\/appointments\?/));
    expect(result.data).toHaveLength(1);
  });

  it('create hace POST /appointments', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ created: true });
    const repo = new AppointmentServiceRepository();
    await repo.create({} as never);
    expect(apiClient.post).toHaveBeenCalledWith('/appointments', {});
  });

  it('detail pide GET /appointments/:id con sufijo', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(detailPayload);
    const repo = new AppointmentServiceRepository();
    const doc = await repo.detail('a1', '?include=patient');
    expect(apiClient.get).toHaveBeenCalledWith('/appointments/a1?include=patient');
    expect(doc.data.id).toBe('a1');
  });
});
