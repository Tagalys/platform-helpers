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
        this.getSearchSuggestionsQuery = function (resourcesToRequest) {
            var query = '';
            if (resourcesToRequest.includes('queries')) {
                query += "\n        queries {\n          text\n        }\n      ";
            }
            if (resourcesToRequest.includes('collections')) {
                query += "\n        collections {\n          id\n          title\n          onlineStoreUrl\n        }\n      ";
            }
            if (resourcesToRequest.includes('products')) {
                query += "\n        products {\n          ".concat(_this.queries.getProductDetails(), "\n        }\n      ");
            }
            if (resourcesToRequest.includes('pages')) {
                query += "\n        pages {\n          id\n          title\n          onlineStoreUrl\n        }\n      ";
            }
            if (resourcesToRequest.includes('articles')) {
                query += "\n        articles {\n          id\n          title\n          onlineStoreUrl\n        }\n      ";
            }
            return query;
        };
        this.requestState = requestState;
        this.responseState = responseState;
        this.queries = new graphql_queries_1.default();
        this.graphqlResponseFormatter = new grapqhl_to_common_response_formatter_1.default();
    }
    SearchSuggestions.prototype.getQuery = function () {
        var _a, _b;
        var _c = this.validateRequest(), valid = _c.valid, message = _c.message;
        if (!valid) {
            throw new Error(message);
        }
        var resourcesToRequest = this.getResourcesToRequest();
        var query = this.getSearchSuggestionsQuery(resourcesToRequest);
        var isProductRequested = resourcesToRequest.includes('products');
        var isSearchableFieldsProvided = (((_b = (_a = this.requestState.params) === null || _a === void 0 ? void 0 : _a.searchableFields) === null || _b === void 0 ? void 0 : _b.length) > 0);
        return "\n      query SearchSuggestions(\n        $query: String!,\n        $types: [PredictiveSearchType!],\n        ".concat(isProductRequested ? '$product_metafields: [HasMetafieldsIdentifier!]!' : '', ",\n        ").concat(isSearchableFieldsProvided ? "$searchableFields: '[SearchableField!]" : '', "\n      ) @inContext(\n          country: ").concat(global_context_1.default.configuration.getCountryCode(), ",\n          language: ").concat(global_context_1.default.configuration.getLanguageCode(), "\n        ){\n        predictiveSearch(\n          query: $query,\n          limitScope: EACH,\n          limit: 10,\n          unavailableProducts: ").concat(this.requestState.params.unavailableProducts, ",\n          ").concat(isSearchableFieldsProvided ? "searchableFields: $searchableFields" : '', ",\n          types: $types\n        ){\n          ").concat(query, "\n        }\n      }\n    ");
    };
    SearchSuggestions.prototype.getQueryVariables = function () {
        var _this = this;
        var _a, _b;
        var queryVariables = __assign({ query: "".concat(this.requestState.params.query), types: this.getResourcesToRequest().map(function (resource) { return _this.getSearchableResourceType(resource); }) }, this.getMetafieldVariables());
        if (((_b = (_a = this.requestState.params) === null || _a === void 0 ? void 0 : _a.searchableFields) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            queryVariables.searchableFields = this.requestState.params.searchableFields;
        }
        return queryVariables;
    };
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
    SearchSuggestions.prototype.getSearchableResourceType = function (resource) {
        switch (resource) {
            case 'collections':
                return 'COLLECTION';
            case 'products':
                return 'PRODUCT';
            case 'pages':
                return 'PAGE';
            case 'articles':
                return 'ARTICLE';
            case 'queries':
                return 'QUERY';
        }
    };
    SearchSuggestions.prototype.validateRequest = function () {
        // validate only queries, collections, products, pages, articles are requested
        var allowedResources = ['queries', 'collections', 'products', 'pages', 'articles'];
        var requestedResources = this.getResourcesToRequest();
        var hasRequestedAllowedTypes = requestedResources.every(function (type) { return allowedResources.includes(type); });
        return {
            valid: hasRequestedAllowedTypes,
            message: hasRequestedAllowedTypes ? '' : "Invalid request type requested, allowed types are ".concat(allowedResources.join(', '))
        };
    };
    SearchSuggestions.prototype.getResourcesToRequest = function () {
        return Object.keys(this.requestState.params.request);
    };
    SearchSuggestions.prototype.formatResponse = function (_, shopifyResponse) {
        var _this = this;
        var response = {
            queries: [],
            products: [],
        };
        var shopifyResponseData = shopifyResponse.predictiveSearch;
        var resourcesToRequest = this.getResourcesToRequest();
        resourcesToRequest.forEach(function (resource) {
            var limit = _this.requestState.params.request[resource].limit;
            if (shopifyResponseData[resource].length > 0) {
                switch (resource) {
                    case "queries": {
                        var thisSection = {
                            section_id: "queries",
                            section_title: "Queries",
                            items: shopifyResponseData.queries.slice(0, limit).map(function (query) { return ({
                                displayString: query.text,
                                queryString: "".concat(_this.requestState.queryStringConfiguration.queryParameter, "=").concat(query.text),
                            }); }),
                        };
                        response.queries.push(thisSection);
                        break;
                    }
                    case "collections": {
                        var thisSection = {
                            section_id: "collections",
                            section_title: "Collections",
                            items: shopifyResponseData.collections.slice(0, limit).map(function (collection) { return ({
                                displayString: collection.title,
                                link: collection.onlineStoreURL,
                            }); }),
                        };
                        response.queries.push(thisSection);
                        break;
                    }
                    case "pages": {
                        var thisSection = {
                            section_id: "pages",
                            section_title: "Pages",
                            items: shopifyResponseData.pages.slice(0, limit).map(function (page) { return ({
                                displayString: page.title,
                                link: page.onlineStoreUrl,
                            }); }),
                        };
                        response.queries.push(thisSection);
                        break;
                    }
                    case "articles": {
                        var thisSection = {
                            section_id: "articles",
                            section_title: "Articles",
                            items: shopifyResponseData.articles.slice(0, limit).map(function (article) { return ({
                                displayString: article.title,
                                link: article.onlineStoreUrl,
                            }); }),
                        };
                        response.queries.push(thisSection);
                        break;
                    }
                    case "products": {
                        response.products = shopifyResponseData.products.slice(0, limit).map(function (product) {
                            return _this.graphqlResponseFormatter.formatProduct(product);
                        });
                        break;
                    }
                    default:
                        break;
                }
            }
        });
        return response;
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