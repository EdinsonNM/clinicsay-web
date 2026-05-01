import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../errors/app-error';
import { ApiClient } from './api-client';

describe('ApiClient', () => {
  it('get devuelve el cuerpo JSON cuando la respuesta es correcta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      }),
    );
    const client = new ApiClient('http://example.test');
    await expect(client.get('/ruta')).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith('http://example.test/ruta', undefined);
  });

  it('post envía JSON y devuelve la respuesta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: '1' }),
      }),
    );
    const client = new ApiClient('http://example.test');
    await expect(client.post('/citas', { a: 1 })).resolves.toEqual({ id: '1' });
    expect(fetch).toHaveBeenCalledWith('http://example.test/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: 1 }),
    });
  });

  it('lanza AppError cuando la respuesta no es ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ message: 'invalido' }),
      }),
    );
    const client = new ApiClient('http://example.test');
    await expect(client.get('/x')).rejects.toSatisfy(
      (err: unknown) => err instanceof AppError && err.message === 'invalido' && err.status === 422,
    );
  });

  it('concatena mensaje cuando message es arreglo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: ['a', 'b'] }),
      }),
    );
    const client = new ApiClient('http://example.test');
    await expect(client.get('/x')).rejects.toSatisfy(
      (err: unknown) => err instanceof AppError && err.message === 'a, b',
    );
  });

  it('usa mensaje por defecto si no hay message en el cuerpo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    );
    const client = new ApiClient('http://example.test');
    await expect(client.get('/x')).rejects.toSatisfy(
      (err: unknown) => err instanceof AppError && err.message === 'Solicitud invalida',
    );
  });

  it('lanza AppError de red cuando fetch rechaza', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const client = new ApiClient('http://example.test');
    await expect(client.get('/x')).rejects.toSatisfy(
      (err: unknown) =>
        err instanceof AppError &&
        err.message.includes('No se pudo contactar la API') &&
        err.status === 0,
    );
  });
});
