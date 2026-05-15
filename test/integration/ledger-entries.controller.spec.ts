import { LedgerEntriesController } from "../../src/banking-proxy/controllers/ledger-entries.controller";

describe("LedgerEntriesController", () => {
  it("maps request to upstream ledger endpoint and preserves 4xx body", async () => {
    const post = jest.fn().mockResolvedValue({
      status: 409,
      body: { code: "duplicate_reference", correlation_id: "corr-2" }
    });
    const controller = new LedgerEntriesController({ post } as any);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response = { status };

    const payload = { ledger_entry: { reference_type: "transfer", reference_id: "r1", entries: [] } };
    await controller.postLedgerEntries(payload, { correlationId: "corr-2" }, response);

    expect(post).toHaveBeenCalledWith("/banking_admin/api/v1/ledger_entries", payload, "corr-2");
    expect(status).toHaveBeenCalledWith(409);
    expect(send).toHaveBeenCalledWith({ code: "duplicate_reference", correlation_id: "corr-2" });
  });
});
