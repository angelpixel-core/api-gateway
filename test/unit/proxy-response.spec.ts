import { sendProxyResponse } from "../../src/shared/proxy-response";

describe("sendProxyResponse", () => {
  it("passes status and body to response", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response = { status };

    sendProxyResponse(response, 422, { code: "invalid_request" });

    expect(status).toHaveBeenCalledWith(422);
    expect(send).toHaveBeenCalledWith({ code: "invalid_request" });
  });
});
