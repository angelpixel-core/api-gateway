"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProxyResponse = sendProxyResponse;
function sendProxyResponse(response, status, body) {
    response.status(status).send(body);
}
