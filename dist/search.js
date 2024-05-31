"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var grapqhl_to_common_response_formatter_1 = require("./lib/grapqhl-to-common-response-formatter");
var global_context_1 = require("./lib/global-context");
var product_listing_page_base_1 = require("./product-listing-page-base");
var DEFAULT_SORT_OPTIONS = [
    {
        "id": "relevance",
        "label": "Relevance"
    },
    {
        "id": "price-asc",
        "label": "Price, low to high"
    },
    {
        "id": "price-desc",
        "label": "Price, high to low"
    }
];
var Search = /** @class */ (function (_super) {
    __extends(Search, _super);
    function Search() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Search.prototype.getQuery = function () {
        return "\n      query Search(\n        $query: String!,\n        $first: Int,\n        $last: Int,\n        $before: String,\n        $after: String,\n        $sortKey: SearchSortKeys,\n        $reverse: Boolean,\n        $filters:  [ProductFilter!],\n        $product_metafields: [HasMetafieldsIdentifier!]!,\n        $prefix: SearchPrefixQueryType,\n        $unavailableProducts: SearchUnavailableProductsType,\n        $types: [SearchType!]\n      ) @inContext(\n          country: ".concat(global_context_1.default.configuration.getCountryCode(), ",\n          language: ").concat(global_context_1.default.configuration.getLanguageCode(), "\n        ) {\n        search(\n          query: $query,\n          first: $first,\n          last: $last,\n          after: $after,\n          before: $before,\n          reverse: $reverse,\n          sortKey: $sortKey,\n          productFilters: $filters,\n          prefix: $prefix,\n          unavailableProducts: $unavailableProducts,\n          types: $types,\n        ){\n          totalCount\n          edges{\n            node{\n              ... on Product{\n                ").concat(this.queries.getProductDetails(), "\n              }\n            }\n          }\n          filters: productFilters {\n            id\n            label\n            type\n            values {\n              id\n              label\n              count\n              input\n            }\n          }\n          pageInfo{\n            hasNextPage\n            hasPreviousPage\n            endCursor\n            startCursor\n          }\n        }\n      }\n    ");
    };
    Search.prototype.getQueryVariables = function () {
        return __assign(__assign(__assign(__assign({ query: "".concat(this.requestState.query), unavailableProducts: this.requestState.unavailableProducts, prefix: this.requestState.prefix, types: this.requestState.types }, this.getSortVariables()), this.getPaginationVariables()), this.getFilterVariables()), this.getMetafieldVariables());
    };
    Search.prototype.getSortVariables = function () {
        // for sort option id, refer DEFAULT_SORT_OPTIONS
        var sortOptionIdToSortKeyMap = {
            'relevance': {
                sortKey: 'RELEVANCE',
                reverse: false,
            },
            'price-desc': {
                sortKey: 'PRICE',
                reverse: true,
            },
            'price-asc': {
                sortKey: 'PRICE',
                reverse: false
            }
        };
        return sortOptionIdToSortKeyMap[this.requestState.sort];
    };
    Search.getFilterInputsQuery = function () {
        return "\n    query Search(\n      $query: String!,\n    ) {\n      search(query: $query, first: 1){\n        filters: productFilters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n      }\n    }\n    ";
    };
    Search.prototype.getDataForInitialRequest = function (requestOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var filterInputsQuery, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterInputsQuery = Search.getFilterInputsQuery();
                        return [4 /*yield*/, this.apiClient().call("POST", "graphql.json", {
                                params: JSON.stringify({
                                    query: filterInputsQuery,
                                    variables: {
                                        query: "".concat(this.requestState.query),
                                    }
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.getFilterData(response.search.filters)];
                }
            });
        });
    };
    Search.prototype.formatResponse = function (requestOptions, shopifyResponse) {
        var _this = this;
        // handle empty node: {}
        return {
            query: this.requestState.query,
            products: shopifyResponse.search.edges.map(function (productEdge) { return _this.graphqlResponseFormatter.formatProduct(productEdge.node); }),
            filters: this.graphqlResponseFormatter.formatFilters(shopifyResponse.search.filters, this.requestState.filters, this.responseState.price_ranges),
            sort_options: this.getSortOptions(requestOptions, DEFAULT_SORT_OPTIONS),
            page_info: shopifyResponse.search.pageInfo,
            filter_inputs: grapqhl_to_common_response_formatter_1.default.getFilterInputs(shopifyResponse.search.filters),
            total: shopifyResponse.search.totalCount,
        };
    };
    Search.prototype.helpersToExpose = function () {
        var _this = this;
        return {
            getQuery: function () { return _this.getQuery(); },
            getQueryVariables: function () { return _this.getQueryVariables(); },
            formatResponse: function (requestOptions, shopifyResponse) { return _this.formatResponse(requestOptions, shopifyResponse); },
            getFilterInputs: function (filtersFromResponse) { return grapqhl_to_common_response_formatter_1.default.getFilterInputs(filtersFromResponse); },
            getDataForInitialRequest: function (requestOptions) { return _this.getDataForInitialRequest(requestOptions); },
        };
    };
    Search.export = function () {
        var _this = this;
        return {
            Search: {
                new: function (requestState, responseState) {
                    var instance = new _this(requestState, responseState);
                    return instance.helpersToExpose();
                }
            }
        };
    };
    return Search;
}(product_listing_page_base_1.default));
exports.default = Search;
//# sourceMappingURL=search.js.map