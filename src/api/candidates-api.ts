import { type APIRequestContext } from '@playwright/test';
import { ENV } from '@helpers/env';

// Candidates API — wraps /candidates endpoints.
// Token is passed in from the fixture so each test gets a fresh auth context.
export class CandidatesApi {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.baseUrl = ENV.API_BASE_URL;
    this.token = token;
  }

  private headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  async createCandidate(payload: Record<string, unknown>) {
    const response = await this.request.post(`${this.baseUrl}/candidates`, {
      headers: this.headers(),
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(`Create candidate failed: ${response.status()}`);
    }

    return response.json();
  }

  async getCandidateById(id: string) {
    const response = await this.request.get(`${this.baseUrl}/candidates/${id}`, {
      headers: this.headers(),
    });

    if (!response.ok()) {
      throw new Error(`Get candidate failed: ${response.status()}`);
    }

    return response.json();
  }

  async listCandidates(page = 1, limit = 20) {
    const response = await this.request.get(
      `${this.baseUrl}/candidates?page=${page}&limit=${limit}`,
      { headers: this.headers() }
    );

    if (!response.ok()) {
      throw new Error(`List candidates failed: ${response.status()}`);
    }

    return response.json();
  }

  async updateCandidateStatus(id: string, status: string) {
    const response = await this.request.patch(`${this.baseUrl}/candidates/${id}/status`, {
      headers: this.headers(),
      data: { status },
    });

    if (!response.ok()) {
      throw new Error(`Status update failed: ${response.status()}`);
    }

    return response.json();
  }

  async deleteCandidate(id: string) {
    const response = await this.request.delete(`${this.baseUrl}/candidates/${id}`, {
      headers: this.headers(),
    });

    if (!response.ok()) {
      throw new Error(`Delete candidate failed: ${response.status()}`);
    }
  }

  async getNLPParseResult(candidateId: string) {
    const response = await this.request.get(
      `${this.baseUrl}/candidates/${candidateId}/nlp-parse`,
      { headers: this.headers() }
    );

    if (!response.ok()) {
      throw new Error(`NLP parse fetch failed: ${response.status()}`);
    }

    return response.json();
  }

  // For auth boundary tests — no token sent.
  async getCandidateWithoutAuth(id: string): Promise<number> {
    const response = await this.request.get(`${this.baseUrl}/candidates/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.status();
  }
}
