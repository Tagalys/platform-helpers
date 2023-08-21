"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalContext = /** @class */ (function () {
    function GlobalContext() {
    }
    GlobalContext.prototype.set = function (opts) {
        this.configuration = opts.configuration;
        this.shopifyConfiguration = opts.shopifyConfiguration;
    };
    GlobalContext.prototype.getConfiguration = function () {
        return this.configuration;
    };
    GlobalContext.prototype.getShopifyConfiguration = function () {
        return this.shopifyConfiguration;
    };
    return GlobalContext;
}());
exports.default = new GlobalContext();
//# sourceMappingURL=global-context.js.map