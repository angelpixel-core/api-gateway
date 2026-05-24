import { logGatewayEvent } from "../../src/observability/gateway-logger";

describe("gateway logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("emits json line with required schema fields", () => {
    const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);

    logGatewayEvent({
      event: "gateway.request.received",
      status: "received",
      correlation_id: "corr-1"
    });

    const [line] = writeSpy.mock.calls[0] as [string];
    const payload = JSON.parse(line);

    expect(payload.service).toBe("api-gateway");
    expect(payload.event).toBe("gateway.request.received");
    expect(payload.status).toBe("received");
    expect(payload.correlation_id).toBe("corr-1");
    expect(payload.timestamp).toBeDefined();
  });
});
