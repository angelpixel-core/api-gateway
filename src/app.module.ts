import { Module } from "@nestjs/common";

import { AuthBoundaryModule } from "./auth-boundary/auth-boundary.module";
import { BankingProxyModule } from "./banking-proxy/banking-proxy.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [AuthBoundaryModule, BankingProxyModule],
  controllers: [HealthController]
})
export class AppModule {}
