import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './env';

describe('resolveApiBaseUrl', () => {
  it('uses the local API default when no value is provided', () => {
    expect(resolveApiBaseUrl()).toBe('http://localhost:3000/api/v1');
  });

  it('normalizes a configured API base URL', () => {
    expect(resolveApiBaseUrl(' http://api:3000/api/v1/ ')).toBe(
      'http://api:3000/api/v1',
    );
  });

  it('rejects invalid API base URLs', () => {
    expect(() => resolveApiBaseUrl('not-a-url')).toThrow(
      'VITE_API_BASE_URL invalida',
    );
  });
});
