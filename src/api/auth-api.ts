import { type APIRequestContext } from '@playwright/test';
import { ENV } from '@helpers/env';

// Auth API — login and token handling for API tests.
export class AuthApi {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = ENV.API_BASE_URL;
  }

  async login(email: string, password: string) {
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()}`);
    }

    return response.json();
  }

  // Used in negative tests — returns status code without throwing.
  async loginGetStatus(email: string, password: string): Promise<number> {
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    });
    return response.status();
  }
}
