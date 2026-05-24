import * as crypto from "node:crypto";

import { of } from "rxjs";

import { CorrelationIdInterceptor } from "../../src/auth-boundary/correlation-id.interceptor";
import * as gatewayLogger from "../../src/observability/gateway-logger";

describe("CorrelationIdInterceptor", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.CORRELATION_HEADER_NAME;
  });

  it("forwards incoming correlation id and sets response header", () => {
    const interceptor = new CorrelationIdInterceptor();
    const request: { headers: Record<string, string | undefined>; correlationId?: string } = {
      headers: { "x-correlation-id": "corr-incoming" }
    };
    const setHeader = jest.fn();
    const next = { handle: jest.fn(() => of("ok")) };

    const loggerSpy = jest.spyOn(gatewayLogger, "logGatewayEvent").mockImplementation(() => undefined);

    interceptor.intercept(mockContext(request, setHeader), next);

    expect(request.correlationId).toBe("corr-incoming");
    expect(setHeader).toHaveBeenCalledWith("X-Correlation-ID", "corr-incoming");
    expect(loggerSpy).toHaveBeenCalledWith({
      event: "gateway.request.received",
      status: "received",
      correlation_id: "corr-incoming"
    });
    expect(next.handle).toHaveBeenCalledTimes(1);
  });

  it("generates correlation id when missing", () => {
    const interceptor = new CorrelationIdInterceptor();
    const request: { headers: Record<string, string | undefined>; correlationId?: string } = {
      headers: {}
    };
    const setHeader = jest.fn();
    const next = { handle: jest.fn(() => of("ok")) };

    jest.spyOn(crypto, "randomUUID").mockReturnValue("11111111-1111-4111-8111-111111111111");

    interceptor.intercept(mockContext(request, setHeader), next);

    expect(request.correlationId).toBe("11111111-1111-4111-8111-111111111111");
    expect(setHeader).toHaveBeenCalledWith("X-Correlation-ID", "11111111-1111-4111-8111-111111111111");
  });

  it("uses configured correlation header name", () => {
    process.env.CORRELATION_HEADER_NAME = "x-request-id";

    const interceptor = new CorrelationIdInterceptor();
    const request: { headers: Record<string, string | undefined>; correlationId?: string } = {
      headers: { "x-request-id": "corr-custom" }
    };
    const setHeader = jest.fn();
    const next = { handle: jest.fn(() => of("ok")) };

    interceptor.intercept(mockContext(request, setHeader), next);

    expect(request.correlationId).toBe("corr-custom");
    expect(setHeader).toHaveBeenCalledWith("X-Correlation-ID", "corr-custom");
  });
});

function mockContext(request: unknown, setHeader: (name: string, value: string) => void): any {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({ setHeader })
    })
  };
}
