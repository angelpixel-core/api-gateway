"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBoundaryModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const correlation_id_interceptor_1 = require("./correlation-id.interceptor");
const stub_auth_guard_1 = require("./stub-auth.guard");
let AuthBoundaryModule = class AuthBoundaryModule {
};
exports.AuthBoundaryModule = AuthBoundaryModule;
exports.AuthBoundaryModule = AuthBoundaryModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: stub_auth_guard_1.StubAuthGuard
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: correlation_id_interceptor_1.CorrelationIdInterceptor
            }
        ]
    })
], AuthBoundaryModule);
