"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_queries_1 = require("./lib/graphql-queries");
var grapqhl_to_common_response_formatter_1 = require("./lib/grapqhl-to-common-response-formatter");
var global_context_1 = require("./lib/global-context");
var RecentViewedProducts = /** @class */ (function () {
    function RecentViewedProducts(requestState, responseState) {
        this.queries = new graphql_queries_1.default();
        this.graphqlResponseFormatter = new grapqhl_to_common_response_formatter_1.default();
    }
    RecentViewedProducts.prototype.formatProductGids = function (productIds) {
        return productIds.map(function (id) { return "gid://shopify/Product/".concat(id); });
    };
    RecentViewedProducts.prototype.getMetafieldVariables = function () {
        if (!global_context_1.default.shopifyConfiguration.hasMetafields()) {
            return { product_metafields: [] };
        }
        var metafieldsToQuery = global_context_1.default.shopifyConfiguration.getMetafields();
        return {
            product_metafields: (metafieldsToQuery.products || []),
        };
    };
    RecentViewedProducts.prototype.getQuery = function () {
        var languageCode = global_context_1.default.configuration.getLanguageCode();
        return "\n      query GetProductsByIds(\n        $ids: [ID!]!,\n        $product_metafields: [HasMetafieldsIdentifier!]!\n      ) @inContext(\n          country: ".concat(global_context_1.default.configuration.getCountryCode(), ",\n          ").concat(languageCode ? "language: ".concat(languageCode) : '', "\n        ) {\n        nodes(ids: $ids) {\n          ... on Product {\n            ").concat(this.queries.getProductDetails(), "\n          }\n        }\n      }\n    ");
    };
    // --- GraphQL Query Variables ---
    RecentViewedProducts.prototype.getQueryVariables = function (productIds) {
        return __assign({ ids: this.formatProductGids(productIds) }, this.getMetafieldVariables());
    };
    RecentViewedProducts.prototype.formatResponse = function (_, shopifyResponse) {
        var _this = this;
        var products = shopifyResponse.nodes
            .filter(function (node) { return node !== null; })
            .map(function (node) { return _this.graphqlResponseFormatter.formatProduct(node); });
        return { products: products };
    };
    RecentViewedProducts.prototype.helpersToExpose = function () {
        var _this = this;
        return {
            getQuery: function () { return _this.getQuery(); },
            getQueryVariables: function (productIds) { return _this.getQueryVariables(productIds); },
            formatResponse: function (requestOptions, shopifyResponse) { return _this.formatResponse(requestOptions, shopifyResponse); },
        };
    };
    RecentViewedProducts.export = function () {
        var _this = this;
        return {
            RecentlyViewedProducts: {
                new: function (requestState, responseState) {
                    var instance = new _this(requestState, responseState);
                    return instance.helpersToExpose();
                }
            }
        };
    };
    return RecentViewedProducts;
}());
exports.default = RecentViewedProducts;
//# sourceMappingURL=recently-viewed-products.js.map