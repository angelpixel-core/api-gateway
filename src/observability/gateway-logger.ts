type GatewayStatus = "received" | "accepted" | "proxied" | "completed" | "rejected" | "failed" | "degraded" | "fallback";

type GatewayLogEvent = {
  event: "gateway.request.received" | "gateway.request.proxied" | "gateway.request.failed" | "gateway.trace.span";
  status: GatewayStatus;
  correlation_id: string;
  workflow_step?: string;
  reference_type?: string;
  reference_id?: string;
  duration_ms?: number;
  error_code?: string;
};

export function logGatewayEvent(event: GatewayLogEvent): void {
  const payload = {
    service: "api-gateway",
    ...event,
    timestamp: new Date().toISOString()
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
}
