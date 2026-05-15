"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingProxyModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_controller_1 = require("./controllers/accounts.controller");
const balances_controller_1 = require("./controllers/balances.controller");
const ledger_entries_controller_1 = require("./controllers/ledger-entries.controller");
const banking_admin_http_client_service_1 = require("./services/banking-admin-http-client.service");
let BankingProxyModule = class BankingProxyModule {
};
exports.BankingProxyModule = BankingProxyModule;
exports.BankingProxyModule = BankingProxyModule = __decorate([
    (0, common_1.Module)({
        controllers: [accounts_controller_1.AccountsController, ledger_entries_controller_1.LedgerEntriesController, balances_controller_1.BalancesController],
        providers: [banking_admin_http_client_service_1.BankingAdminHttpClient]
    })
], BankingProxyModule);
