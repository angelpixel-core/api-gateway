import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { logGatewayEvent } from "../../observability/gateway-logger";

type ProxyResult = {
  status: number;
  body: unknown;
  headers: Headers;
};

type RequestMetadata = {
  referenceType?: string;
  referenceId?: string;
};

@Injectable()
export class BankingAdminHttpClient {
  private readonly baseUrl = process.env.BANKING_ADMIN_BASE_URL ?? "http://127.0.0.1:3000";

  async post(path: string, payload: unknown, correlationId: string, metadata: RequestMetadata = {}): Promise<ProxyResult> {
    return this.request(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId
      },
      body: JSON.stringify(payload)
    }, correlationId, metadata);
  }

  async get(path: string, query: URLSearchParams, correlationId: string, metadata: RequestMetadata = {}): Promise<ProxyResult> {
    const queryString = query.toString();
    const requestPath = queryString.length > 0 ? `${path}?${queryString}` : path;

    return this.request(requestPath, {
      method: "GET",
      headers: {
        "X-Correlation-ID": correlationId
      }
    }, correlationId, metadata);
  }

  private async request(path: string, init: RequestInit, correlationId: string, metadata: RequestMetadata): Promise<ProxyResult> {
    const startedAt = Date.now();
    const response = await fetch(`${this.baseUrl}${path}`, init).catch((error: unknown) => {
      logGatewayEvent({
        event: "gateway.request.failed",
        status: "failed",
        correlation_id: correlationId,
        reference_type: metadata.referenceType,
        reference_id: metadata.referenceId,
        duration_ms: Date.now() - startedAt,
        error_code: "upstream_unavailable"
      });

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

    logGatewayEvent({
      event: "gateway.request.proxied",
      status: "proxied",
      correlation_id: correlationId,
      reference_type: metadata.referenceType,
      reference_id: metadata.referenceId,
      duration_ms: Date.now() - startedAt
    });

    return {
      status: response.status,
      body,
      headers: response.headers
    };
  }
}
