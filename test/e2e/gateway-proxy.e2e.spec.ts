import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

import { AppModule } from "../../src/app.module";
import { BankingAdminHttpClient } from "../../src/banking-proxy/services/banking-admin-http-client.service";

describe("API Gateway T4 passthrough", () => {
  let app: INestApplication;

  const postMock = jest.fn();
  const getMock = jest.fn();

  beforeEach(async () => {
    postMock.mockReset();
    getMock.mockReset();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(BankingAdminHttpClient)
      .useValue({
        post: postMock,
        get: getMock
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("proxies POST /api/v1/accounts preserving status/body and forwarding correlation id", async () => {
    postMock.mockResolvedValue({
      status: 201,
      body: { id: "acc-1", correlation_id: "corr-account" },
      headers: new Headers()
    });

    const payload = { account: { account_type: "user", base_currency: "USD" } };

    const response = await request(app.getHttpServer())
      .post("/api/v1/accounts")
      .set("X-Correlation-ID", "corr-account")
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({ id: "acc-1", correlation_id: "corr-account" });
    expect(response.headers["x-correlation-id"]).toBe("corr-account");
    expect(postMock).toHaveBeenCalledWith("/banking_admin/api/v1/accounts", payload, "corr-account");
  });

  it("proxies POST /api/v1/ledger/entries preserving upstream 4xx", async () => {
    postMock.mockResolvedValue({
      status: 409,
      body: { code: "duplicate_reference", correlation_id: "corr-ledger" },
      headers: new Headers()
    });

    const payload = {
      ledger_entry: {
        reference_type: "transfer",
        reference_id: "ref-1",
        entries: []
      }
    };

    const response = await request(app.getHttpServer())
      .post("/api/v1/ledger/entries")
      .set("X-Correlation-ID", "corr-ledger")
      .send(payload)
      .expect(409);

    expect(response.body).toEqual({ code: "duplicate_reference", correlation_id: "corr-ledger" });
    expect(response.headers["x-correlation-id"]).toBe("corr-ledger");
    expect(postMock).toHaveBeenCalledWith("/banking_admin/api/v1/ledger_entries", payload, "corr-ledger");
  });

  it("proxies POST /api/v1/ledger/entries preserving upstream 422 envelope", async () => {
    postMock.mockResolvedValue({
      status: 422,
      body: {
        code: "invalid_request",
        message: "entries unbalanced",
        correlation_id: "corr-ledger-422",
        details: { field: "entries" }
      },
      headers: new Headers()
    });

    const response = await request(app.getHttpServer())
      .post("/api/v1/ledger/entries")
      .set("X-Correlation-ID", "corr-ledger-422")
      .send({ ledger_entry: { reference_type: "transfer", reference_id: "r422", entries: [] } })
      .expect(422);

    expect(response.body).toEqual({
      code: "invalid_request",
      message: "entries unbalanced",
      correlation_id: "corr-ledger-422",
      details: { field: "entries" }
    });
    expect(response.headers["x-correlation-id"]).toBe("corr-ledger-422");
  });

  it("generates correlation id when missing and proxies GET /api/v1/balances", async () => {
    getMock.mockResolvedValue({
      status: 200,
      body: { balances: [], correlation_id: "upstream-corr" },
      headers: new Headers()
    });

    const response = await request(app.getHttpServer())
      .get("/api/v1/balances")
      .query({ account_id: "11111111-1111-1111-1111-111111111111", asset_code: "USD" })
      .expect(200);

    expect(response.body).toEqual({ balances: [], correlation_id: "upstream-corr" });
    expect(response.headers["x-correlation-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    expect(getMock).toHaveBeenCalledTimes(1);
    const [pathArg, queryArg, correlationIdArg] = getMock.mock.calls[0];

    expect(pathArg).toBe("/banking_admin/api/v1/balances");
    expect(queryArg).toBeInstanceOf(URLSearchParams);
    expect((queryArg as URLSearchParams).get("account_id")).toBe("11111111-1111-1111-1111-111111111111");
    expect((queryArg as URLSearchParams).get("asset_code")).toBe("USD");
    expect(correlationIdArg).toBe(response.headers["x-correlation-id"]);
  });

  it("preserves upstream 5xx response without reshaping", async () => {
    postMock.mockResolvedValue({
      status: 500,
      body: {
        code: "internal_error",
        message: "unexpected failure",
        correlation_id: "corr-500"
      },
      headers: new Headers()
    });

    const response = await request(app.getHttpServer())
      .post("/api/v1/accounts")
      .set("X-Correlation-ID", "corr-500")
      .send({ account: { account_type: "user", base_currency: "USD" } })
      .expect(500);

    expect(response.body).toEqual({
      code: "internal_error",
      message: "unexpected failure",
      correlation_id: "corr-500"
    });
    expect(response.headers["x-correlation-id"]).toBe("corr-500");
  });
});
