import { StubAuthGuard } from "../../src/auth-boundary/stub-auth.guard";

describe("StubAuthGuard", () => {
  afterEach(() => {
    delete process.env.AUTH_BOUNDARY_MODE;
  });

  it("always allows request and sets default stub mode", () => {
    const guard = new StubAuthGuard();
    const request: { headers: Record<string, string | undefined>; authBoundaryMode?: string } = { headers: {} };

    const allowed = guard.canActivate(mockContext(request));

    expect(allowed).toBe(true);
    expect(request.authBoundaryMode).toBe("stub");
  });

  it("uses configured auth boundary mode", () => {
    process.env.AUTH_BOUNDARY_MODE = "enforced";

    const guard = new StubAuthGuard();
    const request: { headers: Record<string, string | undefined>; authBoundaryMode?: string } = { headers: {} };

    guard.canActivate(mockContext(request));

    expect(request.authBoundaryMode).toBe("enforced");
  });
});

function mockContext(request: unknown): any {
  return {
    switchToHttp: () => ({
      getRequest: () => request
    })
  };
}
