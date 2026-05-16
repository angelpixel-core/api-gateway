import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  index(): { status: string; service: string } {
    return { status: "ok", service: "api-gateway" };
  }
}
