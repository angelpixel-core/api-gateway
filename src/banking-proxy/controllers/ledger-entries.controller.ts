import { Body, Controller, Post, Req, Res } from "@nestjs/common";

import { sendProxyResponse } from "../../shared/proxy-response";
import { BankingAdminHttpClient } from "../services/banking-admin-http-client.service";

@Controller("ledger/entries")
export class LedgerEntriesController {
  constructor(private readonly bankingAdminHttpClient: BankingAdminHttpClient) {}

  @Post()
  async postLedgerEntries(
    @Body() payload: { ledger_entry?: { reference_type?: string; reference_id?: string } },
    @Req() request: { correlationId: string },
    @Res() response: { status: (code: number) => { send: (body: unknown) => void } }
  ): Promise<void> {
    const upstream = await this.bankingAdminHttpClient.post("/banking_admin/api/v1/ledger_entries", payload, request.correlationId, {
      referenceType: payload.ledger_entry?.reference_type,
      referenceId: payload.ledger_entry?.reference_id
    });
    sendProxyResponse(response, upstream.status, upstream.body);
  }
}
