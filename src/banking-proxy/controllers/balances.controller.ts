import { Controller, Get, Query, Req, Res } from "@nestjs/common";

import { sendProxyResponse } from "../../shared/proxy-response";
import { BankingAdminHttpClient } from "../services/banking-admin-http-client.service";

@Controller("balances")
export class BalancesController {
  constructor(private readonly bankingAdminHttpClient: BankingAdminHttpClient) {}

  @Get()
  async listBalances(
    @Query("account_id") accountId: string | undefined,
    @Query("asset_code") assetCode: string | undefined,
    @Req() request: { correlationId: string },
    @Res() response: { status: (code: number) => { send: (body: unknown) => void } }
  ): Promise<void> {
    const query = new URLSearchParams();

    if (accountId) {
      query.set("account_id", accountId);
    }

    if (assetCode) {
      query.set("asset_code", assetCode);
    }

    const upstream = await this.bankingAdminHttpClient.get("/banking_admin/api/v1/balances", query, request.correlationId);
    sendProxyResponse(response, upstream.status, upstream.body);
  }
}
