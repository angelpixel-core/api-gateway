import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";

import { CorrelationIdInterceptor } from "./correlation-id.interceptor";
import { StubAuthGuard } from "./stub-auth.guard";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: StubAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor
    }
  ]
})
export class AuthBoundaryModule {}
