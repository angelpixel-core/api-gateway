import { HttpException, HttpStatus } from "@nestjs/common";

import { BankingAdminHttpClient } from "../../src/banking-proxy/services/banking-admin-http-client.service";

describe("BankingAdminHttpClient", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
    process.env.BANKING_ADMIN_BASE_URL = "http://banking-admin.local";
  });

  afterEach(() => {
    delete process.env.BANKING_ADMIN_BASE_URL;
  });

  it("sends POST request with correlation and JSON payload", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { "content-type": "application/json" }
    }));

    const client = new BankingAdminHttpClient();
    const payload = { account: { id: "a1" } };

    const result = await client.post("/banking_admin/api/v1/accounts", payload, "corr-post");

    expect(fetchMock).toHaveBeenCalledWith("http://banking-admin.local/banking_admin/api/v1/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": "corr-post"
      },
      body: JSON.stringify(payload)
    });
    expect(result.status).toBe(201);
    expect(result.body).toEqual({ ok: true });
  });

  it("sends GET request with query and returns text payload", async () => {
    fetchMock.mockResolvedValue(new Response("ok", {
      status: 200,
      headers: { "content-type": "text/plain" }
    }));

    const client = new BankingAdminHttpClient();
    const query = new URLSearchParams({ account_id: "a1", asset_code: "USD" });

    const result = await client.get("/banking_admin/api/v1/balances", query, "corr-get");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://banking-admin.local/banking_admin/api/v1/balances?account_id=a1&asset_code=USD",
      {
        method: "GET",
        headers: {
          "X-Correlation-ID": "corr-get"
        }
      }
    );
    expect(result.status).toBe(200);
    expect(result.body).toBe("ok");
  });

  it("maps fetch failures to HttpException 503 upstream_unavailable", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const client = new BankingAdminHttpClient();

    await expect(client.post("/banking_admin/api/v1/accounts", {}, "corr-fail")).rejects.toMatchObject({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      response: {
        code: "upstream_unavailable",
        message: "banking-admin upstream is unavailable"
      }
    } as Partial<HttpException>);
  });
});
