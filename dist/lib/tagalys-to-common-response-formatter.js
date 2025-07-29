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
var global_context_1 = require("./global-context");
var unique = function (value, index, self) {
    return self.indexOf(value) === index;
};
var TagalysToCommonResponseFormatter = /** @class */ (function () {
    function TagalysToCommonResponseFormatter() {
        var _this = this;
        this.formatDetail = function (detail) {
            return __assign(__assign({}, detail), { metafields: _this.formatMetafields(detail) });
        };
    }
    TagalysToCommonResponseFormatter.prototype.formatMetafields = function (detail) {
        for (var namespace in detail.metafields) {
            for (var key in detail.metafields[namespace]) {
                var isConfigured = global_context_1.default.shopifyConfiguration.isMetafieldConfigured(namespace, key, "products");
                if (!isConfigured) {
                    delete detail.metafields[namespace][key];
                    if (Object.keys(detail.metafields[namespace]).length === 0) {
                        delete detail.metafields[namespace];
                    }
                }
            }
        }
        return detail.metafields;
    };
    TagalysToCommonResponseFormatter.prototype.helpersToExpose = function () {
        var _this = this;
        return {
            formatDetail: function (detail) { return _this.formatDetail(detail); }
        };
    };
    TagalysToCommonResponseFormatter.export = function () {
        var _this = this;
        return {
            TagalysToCommonResponseFormatter: {
                new: function () {
                    var instance = new _this();
                    return instance.helpersToExpose();
                }
            }
        };
    };
    return TagalysToCommonResponseFormatter;
}());
exports.default = TagalysToCommonResponseFormatter;
//# sourceMappingURL=tagalys-to-common-response-formatter.js.map