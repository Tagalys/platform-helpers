"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var global_context_1 = require("./global-context");
var graphql_queries_1 = require("./graphql-queries");
var grapqhl_to_common_response_formatter_1 = require("./grapqhl-to-common-response-formatter");
var LanguageTranslation = /** @class */ (function () {
    function LanguageTranslation(productIds) {
        this.productIds = productIds.map(function (productId) { return "gid://shopify/Product/".concat(productId); });
    }
    LanguageTranslation.prototype.translate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, responseJson, graphqlResponseFormatter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://".concat(global_context_1.default.shopifyConfiguration.getMyShopifyDomain(), "/api/").concat(common_1.API_VERSION, "/graphql.json"), {
                            body: JSON.stringify({
                                query: this.getQuery(),
                                variables: this.getQueryVariables(),
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                "X-Shopify-Storefront-Access-Token": global_context_1.default.shopifyConfiguration.getStorefrontAPIAccessToken(),
                            },
                            method: "POST",
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseJson = _a.sent();
                        graphqlResponseFormatter = new grapqhl_to_common_response_formatter_1.default();
                        return [2 /*return*/, responseJson.data.nodes.map(function (product) {
                                return graphqlResponseFormatter.formatProduct(product);
                            })];
                }
            });
        });
    };
    LanguageTranslation.prototype.getQuery = function () {
        var productDetailsQuery = new graphql_queries_1.default().getProductDetails();
        var countryContextQuery = "country: ".concat(global_context_1.default.configuration.getCountryCode());
        var languageContextQuery = "language: ".concat(global_context_1.default.configuration.getLanguageCode());
        return "query allProducts($product_metafields: [HasMetafieldsIdentifier!]!) @inContext(".concat(countryContextQuery, ", ").concat(languageContextQuery, ") {\n      nodes(ids: ").concat(JSON.stringify(this.productIds), "){\n        ... on Product{\n          ").concat(productDetailsQuery, "\n        }\n      }\n    }");
    };
    LanguageTranslation.prototype.getQueryVariables = function () {
        return (0, common_1.getMetafieldsToQuery)();
    };
    return LanguageTranslation;
}());
exports.default = LanguageTranslation;
//# sourceMappingURL=language-translation.js.map