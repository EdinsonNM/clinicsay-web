import { describe, expect, it } from 'vitest';
import { AppError } from './app-error';

describe('AppError', () => {
  it('conserva mensaje y status opcional', () => {
    const err = new AppError('fallo', 404);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
    expect(err.message).toBe('fallo');
    expect(err.status).toBe(404);
  });

  it('permite omitir status', () => {
    const err = new AppError('sin código');
    expect(err.status).toBeUndefined();
  });
});
