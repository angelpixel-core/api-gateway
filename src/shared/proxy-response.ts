type MutableResponse = {
  status: (code: number) => { send: (payload: unknown) => void };
};

export function sendProxyResponse(response: MutableResponse, status: number, body: unknown): void {
  response.status(status).send(body);
}
