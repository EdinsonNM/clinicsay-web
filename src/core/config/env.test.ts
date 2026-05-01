import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './env';

describe('resolveApiBaseUrl', () => {
  it('normaliza URL y quita barra final', () => {
    expect(resolveApiBaseUrl('http://localhost:3000/api/v1/')).toBe('http://localhost:3000/api/v1');
  });

  it('usa default cuando viene vacío', () => {
    expect(resolveApiBaseUrl(undefined)).toContain('localhost');
  });

  it('lanza si la URL es inválida', () => {
    expect(() => resolveApiBaseUrl('::::')).toThrow(/VITE_API_BASE_URL/);
  });
});
