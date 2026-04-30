import { env } from '../config/env';
import { AppError } from '../errors/app-error';

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = env.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    const json = (await response.json().catch(() => ({}))) as { message?: string | string[] };
    if (!response.ok) {
      const message = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      throw new AppError(message ?? 'Solicitud invalida', response.status);
    }
    return json as T;
  }
}

export const apiClient = new ApiClient();
