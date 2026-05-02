import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../errors/app-error';
import { ApiClient } from './api-client';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('get devuelve JSON cuando la respuesta es OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.get('/specialties')).resolves.toEqual({ data: [] });
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/v1/specialties', undefined);
  });

  it('post envía JSON y devuelve el cuerpo parseado', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ created: true }),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.post('/doctors', { name: 'A' })).resolves.toEqual({ created: true });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/v1/doctors',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'A' }),
      }),
    );
  });

  it('lanza AppError cuando fetch rechaza', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('offline'));

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.get('/x')).rejects.toBeInstanceOf(AppError);
  });

  it('lanza AppError cuando la respuesta HTTP no es OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: 'Invalido' }),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.get('/x')).rejects.toMatchObject({
      message: 'Invalido',
      status: 422,
    });
  });

  it('concatena message cuando viene como array', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: ['uno', 'dos'] }),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.get('/x')).rejects.toMatchObject({ message: 'uno, dos' });
  });

  it('usa mensaje por defecto si el cuerpo de error no incluye message', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.get('/x')).rejects.toMatchObject({ message: 'Solicitud invalida' });
  });

  it('patch envía JSON y devuelve el cuerpo parseado', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ updated: true }),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.patch('/doctors/d1', { name: 'X' })).resolves.toEqual({ updated: true });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/v1/doctors/d1',
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'X' }),
      }),
    );
  });

  it('delete completa sin valor de retorno cuando la respuesta es OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    const client = new ApiClient('http://localhost/api/v1');
    await expect(client.delete('/doctors/d1')).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/v1/doctors/d1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
