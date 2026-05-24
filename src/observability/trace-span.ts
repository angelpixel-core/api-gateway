import { logGatewayEvent } from "./gateway-logger";

type SpanContext = {
  correlationId: string;
  workflowStep: string;
  referenceType?: string;
  referenceId?: string;
};

export async function withGatewaySpan<T>(context: SpanContext, fn: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();

  try {
    const result = await fn();

    logGatewayEvent({
      event: "gateway.trace.span",
      status: "completed",
      correlation_id: context.correlationId,
      workflow_step: context.workflowStep,
      reference_type: context.referenceType,
      reference_id: context.referenceId,
      duration_ms: Date.now() - startedAt,
      error_code: undefined
    });

    return result;
  } catch (error: unknown) {
    logGatewayEvent({
      event: "gateway.trace.span",
      status: "failed",
      correlation_id: context.correlationId,
      workflow_step: context.workflowStep,
      reference_type: context.referenceType,
      reference_id: context.referenceId,
      duration_ms: Date.now() - startedAt,
      error_code: error instanceof Error ? error.name : "unknown_error"
    });

    throw error;
  }
}
