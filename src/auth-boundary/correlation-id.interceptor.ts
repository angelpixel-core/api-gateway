import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Observable } from "rxjs";

import { logGatewayEvent } from "../observability/gateway-logger";

const DEFAULT_CORRELATION_HEADER = "x-correlation-id";

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; correlationId?: string }>();
    const response = context.switchToHttp().getResponse<{ setHeader: (name: string, value: string) => void }>();

    const correlationHeader = (process.env.CORRELATION_HEADER_NAME ?? DEFAULT_CORRELATION_HEADER).toLowerCase();
    const incomingCorrelationId = request.headers[correlationHeader];
    const correlationId = incomingCorrelationId && incomingCorrelationId.length > 0 ? incomingCorrelationId : randomUUID();

    request.correlationId = correlationId;
    response.setHeader("X-Correlation-ID", correlationId);
    logGatewayEvent({
      event: "gateway.request.received",
      status: "received",
      correlation_id: correlationId
    });

    return next.handle();
  }
}
