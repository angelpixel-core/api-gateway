"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesController = void 0;
const common_1 = require("@nestjs/common");
const proxy_response_1 = require("../../shared/proxy-response");
const banking_admin_http_client_service_1 = require("../services/banking-admin-http-client.service");
let BalancesController = class BalancesController {
    bankingAdminHttpClient;
    constructor(bankingAdminHttpClient) {
        this.bankingAdminHttpClient = bankingAdminHttpClient;
    }
    async listBalances(accountId, assetCode, request, response) {
        const query = new URLSearchParams();
        if (accountId) {
            query.set("account_id", accountId);
        }
        if (assetCode) {
            query.set("asset_code", assetCode);
        }
        const upstream = await this.bankingAdminHttpClient.get("/banking_admin/api/v1/balances", query, request.correlationId);
        (0, proxy_response_1.sendProxyResponse)(response, upstream.status, upstream.body);
    }
};
exports.BalancesController = BalancesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("account_id")),
    __param(1, (0, common_1.Query)("asset_code")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BalancesController.prototype, "listBalances", null);
exports.BalancesController = BalancesController = __decorate([
    (0, common_1.Controller)("balances"),
    __metadata("design:paramtypes", [banking_admin_http_client_service_1.BankingAdminHttpClient])
], BalancesController);
