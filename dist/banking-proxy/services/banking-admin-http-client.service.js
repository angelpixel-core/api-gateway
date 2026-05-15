"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingAdminHttpClient = void 0;
const common_1 = require("@nestjs/common");
let BankingAdminHttpClient = class BankingAdminHttpClient {
    baseUrl = process.env.BANKING_ADMIN_BASE_URL ?? "http://127.0.0.1:3000";
    async post(path, payload, correlationId) {
        return this.request(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Correlation-ID": correlationId
            },
            body: JSON.stringify(payload)
        });
    }
    async get(path, query, correlationId) {
        const queryString = query.toString();
        const requestPath = queryString.length > 0 ? `${path}?${queryString}` : path;
        return this.request(requestPath, {
            method: "GET",
            headers: {
                "X-Correlation-ID": correlationId
            }
        });
    }
    async request(path, init) {
        const response = await fetch(`${this.baseUrl}${path}`, init).catch((error) => {
            throw new common_1.HttpException({
                code: "upstream_unavailable",
                message: "banking-admin upstream is unavailable"
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE, { cause: error });
        });
        const contentType = response.headers.get("content-type") ?? "";
        const body = contentType.includes("application/json") ? await response.json() : await response.text();
        return {
            status: response.status,
            body,
            headers: response.headers
        };
    }
};
exports.BankingAdminHttpClient = BankingAdminHttpClient;
exports.BankingAdminHttpClient = BankingAdminHttpClient = __decorate([
    (0, common_1.Injectable)()
], BankingAdminHttpClient);
