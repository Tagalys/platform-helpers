"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_queries_1 = require("./lib/graphql-queries");
var shopifyApi_1 = require("./lib/shopifyApi");
var grapqhl_to_common_response_formatter_1 = require("./lib/grapqhl-to-common-response-formatter");
var global_context_1 = require("./lib/global-context");
var Base = /** @class */ (function () {
    function Base(requestState, responseState) {
        this.requestState = requestState;
        this.responseState = responseState;
        this.queries = new graphql_queries_1.default();
        this.graphqlResponseFormatter = new grapqhl_to_common_response_formatter_1.default();
    }
    Base.prototype.apiClient = function () {
        return new shopifyApi_1.default();
    };
    Base.prototype.getPaginationVariables = function () {
        var paginationVariables = {};
        if (this.requestState.endCursor) {
            paginationVariables['after'] = this.requestState.endCursor;
            paginationVariables['first'] = this.requestState.perPage;
        }
        if (this.requestState.startCursor) {
            paginationVariables['before'] = this.requestState.startCursor;
            paginationVariables['last'] = this.requestState.perPage;
        }
        if (!this.requestState.startCursor && !this.requestState.endCursor) {
            paginationVariables['first'] = this.requestState.perPage;
        }
        return paginationVariables;
    };
    Base.prototype.getFilterVariables = function () {
        var _this = this;
        var filterVariables = {};
        if (Object.keys(this.requestState.filters).length) {
            var filtersToApply_1 = [];
            for (var _i = 0, _a = Object.entries(this.requestState.filters); _i < _a.length; _i++) {
                var _b = _a[_i], _ = _b[0], filterValues = _b[1];
                var values = filterValues;
                if (filterValues.hasOwnProperty("selected_min")) {
                    filtersToApply_1.push({
                        price: {
                            min: parseFloat(filterValues['selected_min']),
                            max: parseFloat(filterValues['selected_max'])
                        }
                    });
                }
                else {
                    values.forEach(function (filterValue) {
                        if (_this.responseState.filter_inputs && _this.responseState.filter_inputs[filterValue]) {
                            var selectedFilterValue = _this.responseState.filter_inputs[filterValue];
                            filtersToApply_1.push(JSON.parse(selectedFilterValue.input));
                        }
                    });
                }
            }
            filterVariables['filters'] = filtersToApply_1;
        }
        return filterVariables;
    };
    Base.prototype.getMetafieldVariables = function () {
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
    Base.prototype.getSortOptions = function (requestOptions, defaultSortOptions) {
        var _this = this;
        var sortOptions = (requestOptions.params.sort_options || defaultSortOptions);
        sortOptions.forEach(function (sortOption) {
            if (sortOption.id === _this.requestState.sort) {
                sortOption.selected = true;
            }
            else {
                sortOption.selected = false;
            }
        });
        if (this.requestState.sort === null && sortOptions.length > 0) {
            sortOptions[0].selected = true;
        }
        return sortOptions;
    };
    Base.prototype.getFilterData = function (filtersResponse) {
        var filterInputs = grapqhl_to_common_response_formatter_1.default.getFilterInputs(filtersResponse);
        var rangeFilter = filtersResponse.find(function (filter) { return filter.type === "PRICE_RANGE"; });
        var price_ranges = {};
        if (rangeFilter) {
            price_ranges = JSON.parse(rangeFilter.values[0].input).price;
        }
        var filtersForRequestParams = {};
        var _loop_1 = function (filterId, appliedFilterValues) {
            // checkbox filter
            var appliedFilter = filtersResponse.find(function (filter) { return filter.id === filterId; });
            if (appliedFilter) {
                if (Array.isArray(appliedFilterValues)) {
                    var formattedFilterValues_1 = [];
                    appliedFilterValues.forEach(function (filterLabel) {
                        if (appliedFilter.type === "LIST" || appliedFilter.type === "BOOLEAN") {
                            appliedFilter.values.forEach(function (filterValue) {
                                if (filterLabel === filterValue.label) {
                                    formattedFilterValues_1.push(filterValue.id);
                                }
                            });
                        }
                    });
                    filtersForRequestParams[filterId] = formattedFilterValues_1;
                }
                else {
                    filtersForRequestParams[filterId] = appliedFilterValues;
                }
            }
        };
        for (var _i = 0, _a = Object.entries(this.requestState.filters); _i < _a.length; _i++) {
            var _b = _a[_i], filterId = _b[0], appliedFilterValues = _b[1];
            _loop_1(filterId, appliedFilterValues);
        }
        return {
            filtersForRequestParams: filtersForRequestParams,
            filter_inputs: filterInputs,
            price_ranges: price_ranges
        };
    };
    return Base;
}());
exports.default = Base;
//# sourceMappingURL=product-listing-page-base.js.map