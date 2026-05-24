import { Body, Controller, Post, Req, Res } from "@nestjs/common";

import { sendProxyResponse } from "../../shared/proxy-response";
import { BankingAdminHttpClient } from "../services/banking-admin-http-client.service";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly bankingAdminHttpClient: BankingAdminHttpClient) {}

  @Post()
  async createAccount(
    @Body() payload: unknown,
    @Req() request: { correlationId: string },
    @Res() response: { status: (code: number) => { send: (body: unknown) => void } }
  ): Promise<void> {
    const upstream = await this.bankingAdminHttpClient.post("/banking_admin/api/v1/accounts", payload, request.correlationId, {
      referenceType: "account",
      referenceId: "create"
    });
    sendProxyResponse(response, upstream.status, upstream.body);
  }
}
