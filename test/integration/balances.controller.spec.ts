import { BalancesController } from "../../src/banking-proxy/controllers/balances.controller";

describe("BalancesController", () => {
  it("forwards account_id and asset_code query values to upstream", async () => {
    const get = jest.fn().mockResolvedValue({ status: 200, body: { balances: [] } });
    const controller = new BalancesController({ get } as any);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response = { status };

    await controller.listBalances("acc-1", "USD", { correlationId: "corr-3" }, response);

    expect(get).toHaveBeenCalledTimes(1);
    const [pathArg, queryArg, corrArg] = get.mock.calls[0];
    expect(pathArg).toBe("/banking_admin/api/v1/balances");
    expect((queryArg as URLSearchParams).get("account_id")).toBe("acc-1");
    expect((queryArg as URLSearchParams).get("asset_code")).toBe("USD");
    expect(corrArg).toBe("corr-3");
    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith({ balances: [] });
  });

  it("omits empty filters from upstream query", async () => {
    const get = jest.fn().mockResolvedValue({ status: 200, body: { balances: [] } });
    const controller = new BalancesController({ get } as any);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    await controller.listBalances(undefined, undefined, { correlationId: "corr-4" }, { status });

    const [, queryArg] = get.mock.calls[0];
    expect((queryArg as URLSearchParams).toString()).toBe("");
    expect(send).toHaveBeenCalledWith({ balances: [] });
  });
});
