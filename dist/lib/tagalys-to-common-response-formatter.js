"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_context_1 = require("./global-context");
var unique = function (value, index, self) {
    return self.indexOf(value) === index;
};
var TagalysToCommonResponseFormatter = /** @class */ (function () {
    function TagalysToCommonResponseFormatter() {
        var _this = this;
        this.formatDetail = function (detail) {
            var formattedDetail = {};
            for (var key in detail) {
                switch (key) {
                    case "metafields":
                        formattedDetail.metafields = _this.formatMetafields(detail);
                        break;
                    default:
                        break;
                }
            }
            return formattedDetail;
        };
    }
    TagalysToCommonResponseFormatter.prototype.formatMetafields = function (detail) {
        for (var namespace in detail.metafields) {
            for (var key in detail.metafields[namespace]) {
                var isConfigured = global_context_1.default.shopifyConfiguration.isMetafieldConfigured(namespace, key, "products");
                if (isConfigured) {
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