import { Module } from "@nestjs/common";

import { AccountsController } from "./controllers/accounts.controller";
import { BalancesController } from "./controllers/balances.controller";
import { LedgerEntriesController } from "./controllers/ledger-entries.controller";
import { BankingAdminHttpClient } from "./services/banking-admin-http-client.service";

@Module({
  controllers: [AccountsController, LedgerEntriesController, BalancesController],
  providers: [BankingAdminHttpClient]
})
export class BankingProxyModule {}
