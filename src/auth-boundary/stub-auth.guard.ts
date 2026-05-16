import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class StubAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; authBoundaryMode?: string }>();
    request.authBoundaryMode = process.env.AUTH_BOUNDARY_MODE ?? "stub";
    return true;
  }
}
