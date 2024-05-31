import ShopifyAPI from "./lib/shopifyApi";
declare const _default: {
    MultiMarket: {
        new: () => {
            updateProductDetailsForMarket: (response: any) => Promise<any>;
            resetProductPrices: (response: any) => any;
        };
    };
    Search: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => void;
            getQueryVariables: () => void;
            formatResponse: (requestOptions: any, shopifyResponse: any) => void;
            getFilterInputs: (filtersFromResponse: any) => {};
            getDataForInitialRequest: (requestOptions: any) => void;
        };
    };
    SearchSuggestions: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => string;
            getQueryVariables: () => any;
            formatResponse: (requestOptions: any, shopifyResponse: any) => any;
        };
    };
    ProductListingPage: {
        new: (requestState: any, responseState: any) => {
            getQuery: () => void;
            getQueryVariables: () => void;
            formatResponse: (requestOptions: any, shopifyResponse: any) => void;
            getFilterInputs: (filtersFromResponse: any) => {};
            getDataForInitialRequest: (requestOptions: any) => void;
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
