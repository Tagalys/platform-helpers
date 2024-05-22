import ShopifyAPI from "./lib/shopifyApi";
declare const _default: {
    MultiMarket: {
        new: () => {
            updateProductDetailsForMarket: (response: any) => Promise<any>;
            resetProductPrices: (response: any) => any;
        };
    };
    ProductListingPage: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => string;
            getQueryVariables: () => any;
            formatResponse: (requestOptions: any, shopifyResponse: any) => {
                name: any;
                products: any;
                filters: any;
                sort_options: any;
                page_info: any;
                filter_inputs: {};
            };
            getFilterInputs: (filtersFromResponse: any) => {};
            getDataForInitialRequest: (requestOptions: any) => Promise<{
                filtersForRequestParams: {};
                filter_inputs: {};
                price_ranges: {};
            }>;
        };
    };
    Search: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => string;
            getQueryVariables: () => any;
            formatResponse: (requestOptions: any, shopifyResponse: any) => {
                products: any;
                filters: any;
                sort_options: any;
                page_info: any;
                filter_inputs: {};
            };
            getFilterInputs: (filtersFromResponse: any) => {};
            getDataForInitialRequest: (requestOptions: any) => Promise<{
                filtersForRequestParams: {};
                filter_inputs: {};
                price_ranges: {};
            }>;
        };
    };
    SearchSuggestions: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => string;
            getQueryVariables: () => {
                product_metafields: any;
                query: string;
            };
            formatResponse: (requestOptions: any, shopifyResponse: any) => any;
        };
    };
    TagalysToCommonResponseFormatter: {
        new: () => {
            formatDetail: (detail: any) => any;
        };
    };
    globalContext: {
        set: (opts: any) => void;
        getConfiguration: () => any;
        getShopifyConfiguration: () => any;
    };
    apiClient: () => ShopifyAPI;
};
export default _default;
