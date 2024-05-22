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
var shopifyApi_1 = require("./lib/shopifyApi");
var grapqhl_to_common_response_formatter_1 = require("./lib/grapqhl-to-common-response-formatter");
var global_context_1 = require("./lib/global-context");
var SearchSuggestions = /** @class */ (function () {
    function SearchSuggestions(requestState, responseState) {
        var _this = this;
        this.getSearchSuggestionsQuery = function (requestedTypes) {
            var query = '';
            if (requestedTypes.includes('queries')) {
                query += "\n        queries {\n          text\n        }\n      ";
            }
            if (requestedTypes.includes('collections')) {
                query += "\n        collections {\n          id\n          title\n          handle\n          onlineStoreURL\n        }\n      ";
            }
            if (requestedTypes.includes('products')) {
                query += "\n        products {\n          ".concat(_this.queries.getProductDetails(), "\n        }\n      ");
            }
            if (requestedTypes.includes('pages')) {
                query += "\n        pages {\n          id\n          title\n          handle\n        }\n      ";
            }
            if (requestedTypes.includes('articles')) {
                query += "\n        articles {\n          id\n          title\n          authorV2{\n            name\n          }\n          tags\n          handle\n        }\n      ";
            }
            return query;
        };
        this.requestState = requestState;
        this.responseState = responseState;
        this.queries = new graphql_queries_1.default();
        this.graphqlResponseFormatter = new grapqhl_to_common_response_formatter_1.default();
    }
    SearchSuggestions.prototype.getMetafieldVariables = function () {
        if (!global_context_1.default.shopifyConfiguration.hasMetafields()) {
            return {
                product_metafields: [],
            };
        }
        var metafieldsToQuery = global_context_1.default.shopifyConfiguration.getMetafields();
        return {
            product_metafields: (metafieldsToQuery.products || []),
        };
    };
    SearchSuggestions.prototype.getQueryVariables = function () {
        return __assign({ query: "".concat(this.requestState.params.query) }, this.getMetafieldVariables());
    };
    SearchSuggestions.prototype.validateRequest = function () {
        // validate only queries, collections, products, pages, articles are requested
        var allowedRequestTypes = ['queries', 'collections', 'products', 'pages', 'articles'];
        var requestedTypes = Object.keys(this.requestState.params.request);
        var hasRequestedAllowedTypes = requestedTypes.every(function (type) { return allowedRequestTypes.includes(type); });
        return {
            valid: hasRequestedAllowedTypes,
            message: "Invalid request type requested, allowed types are ".concat(allowedRequestTypes.join(', '))
        };
    };
    SearchSuggestions.prototype.getQuery = function () {
        var _a = this.validateRequest(), valid = _a.valid, message = _a.message;
        if (!valid) {
            throw new Error(message);
        }
        var requestedTypes = Object.keys(this.requestState.params.request);
        var query = this.getSearchSuggestionsQuery(requestedTypes);
        return "\n      query SearchSuggestions(\n        $query: String!,\n        $product_metafields: [HasMetafieldsIdentifier!]!,\n      ) @inContext(\n          country: ".concat(global_context_1.default.configuration.getCountryCode(), ",\n          language: ").concat(global_context_1.default.configuration.getLanguageCode(), "\n        ){\n        predictiveSearch(query: $query, limitScope: EACH, limit: 10){\n          ").concat(query, "\n        }\n      }\n    ");
    };
    SearchSuggestions.prototype.formatResponse = function (_, shopifyResponse) {
        var _this = this;
        var _a, _b, _c, _d;
        var response = {
            queries: [],
            products: [],
        };
        var shopifyResponseData = shopifyResponse.predictiveSearch;
        if (((_a = shopifyResponseData === null || shopifyResponseData === void 0 ? void 0 : shopifyResponseData.collections) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            var thisSection = {
                section_id: "collections",
                section_title: "Collections",
                items: shopifyResponseData.collections.map(function (collection) {
                    return {
                        displayString: collection.title,
                        handle: collection.handle,
                        url: collection.onlineStoreURL,
                    };
                })
            };
            response.queries.push(thisSection);
        }
        if (((_b = shopifyResponseData === null || shopifyResponseData === void 0 ? void 0 : shopifyResponseData.pages) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            var thisSection = {
                section_id: "pages",
                section_title: "Pages",
                items: shopifyResponseData.pages.map(function (page) {
                    return {
                        displayString: page.title,
                        handle: page.handle,
                        url: page.onlineStoreURL,
                    };
                })
            };
            response.queries.push(thisSection);
        }
        if (((_c = shopifyResponseData === null || shopifyResponseData === void 0 ? void 0 : shopifyResponseData.articles) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            var thisSection = {
                section_id: "articles",
                section_title: "Articles",
                items: shopifyResponseData.articles.map(function (article) {
                    return {
                        displayString: article.title,
                        handle: article.handle,
                        url: article.onlineStoreURL,
                    };
                })
            };
            response.queries || (response.queries = []);
            response.queries.push(thisSection);
        }
        if (((_d = shopifyResponseData === null || shopifyResponseData === void 0 ? void 0 : shopifyResponseData.products) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            response.products = shopifyResponseData.products.map(function (product) { return _this.graphqlResponseFormatter.formatProduct(product); });
        }
        // if (shopifyResponseData.queries) {
        //   response.queries = shopifyResponse.predictiveSearch.queries
        // }
        return response;
        // return {
        //   name: shopifyResponse.collection.title,
        //   products: this.graphqlResponseFormatter.formatProducts(shopifyResponse.collection.products),
        // }
    };
    SearchSuggestions.prototype.apiClient = function () {
        return new shopifyApi_1.default();
    };
    SearchSuggestions.prototype.helpersToExpose = function () {
        var _this = this;
        return {
            getQuery: function () { return _this.getQuery(); },
            getQueryVariables: function () { return _this.getQueryVariables(); },
            formatResponse: function (requestOptions, shopifyResponse) { return _this.formatResponse(requestOptions, shopifyResponse); },
        };
    };
    SearchSuggestions.export = function () {
        var _this = this;
        return {
            SearchSuggestions: {
                new: function (requestState, responseState) {
                    var instance = new _this(requestState, responseState);
                    return instance.helpersToExpose();
                }
            }
        };
    };
    return SearchSuggestions;
}());
exports.default = SearchSuggestions;
//# sourceMappingURL=search-suggestions.js.map