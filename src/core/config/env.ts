const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

export function resolveApiBaseUrl(value?: string): string {
  const candidate = value?.trim() || DEFAULT_API_BASE_URL;
  try {
    return new URL(candidate).toString().replace(/\/$/, '');
  } catch {
    throw new Error(`VITE_API_BASE_URL invalida: ${candidate}`);
  }
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
};
