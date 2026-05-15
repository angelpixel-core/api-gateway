import { AccountsController } from "../../src/banking-proxy/controllers/accounts.controller";

describe("AccountsController", () => {
  it("maps request to upstream accounts endpoint and passthrough response", async () => {
    const post = jest.fn().mockResolvedValue({ status: 201, body: { id: "acc-1" } });
    const controller = new AccountsController({ post } as any);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response = { status };

    const payload = { account: { account_type: "user", base_currency: "USD" } };
    await controller.createAccount(payload, { correlationId: "corr-1" }, response);

    expect(post).toHaveBeenCalledWith("/banking_admin/api/v1/accounts", payload, "corr-1");
    expect(status).toHaveBeenCalledWith(201);
    expect(send).toHaveBeenCalledWith({ id: "acc-1" });
  });
});
