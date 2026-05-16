import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

type ProxyResult = {
  status: number;
  body: unknown;
  headers: Headers;
};

@Injectable()
export class BankingAdminHttpClient {
  private readonly baseUrl = process.env.BANKING_ADMIN_BASE_URL ?? "http://127.0.0.1:3000";

  async post(path: string, payload: unknown, correlationId: string): Promise<ProxyResult> {
    return this.request(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId
      },
      body: JSON.stringify(payload)
    });
  }

  async get(path: string, query: URLSearchParams, correlationId: string): Promise<ProxyResult> {
    const queryString = query.toString();
    const requestPath = queryString.length > 0 ? `${path}?${queryString}` : path;

    return this.request(requestPath, {
      method: "GET",
      headers: {
        "X-Correlation-ID": correlationId
      }
    });
  }

  private async request(path: string, init: RequestInit): Promise<ProxyResult> {
    const response = await fetch(`${this.baseUrl}${path}`, init).catch((error: unknown) => {
      throw new HttpException(
        {
          code: "upstream_unavailable",
          message: "banking-admin upstream is unavailable"
        },
        HttpStatus.SERVICE_UNAVAILABLE,
        { cause: error as Error }
      );
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();

    return {
      status: response.status,
      body,
      headers: response.headers
    };
  }
}
