import ShopifyAPI from './lib/shopifyApi';
declare class Base {
    requestState: any;
    responseState: any;
    queries: any;
    graphqlResponseFormatter: any;
    constructor(requestState: any, responseState: any);
    apiClient(): ShopifyAPI;
    getPaginationVariables(): {};
    getFilterVariables(): {};
    getMetafieldVariables(): {
        product_metafields: any;
    };
    getSortOptions(requestOptions: any, defaultSortOptions: any): any;
    getQuery(): void;
    getQueryVariables(): void;
    formatResponse(requestOptions: any, shopifyResponse: any): void;
    getDataForInitialRequest(requestOptions: any): void;
    getFilterData(filtersResponse: any): {
        filtersForRequestParams: {};
        filter_inputs: {};
        price_ranges: {};
    };
    helpersToExpose(): {
        getQuery: () => void;
        getQueryVariables: () => void;
        formatResponse: (requestOptions: any, shopifyResponse: any) => void;
        getFilterInputs: (filtersFromResponse: any) => {};
        getDataForInitialRequest: (requestOptions: any) => void;
    };
}
export default Base;
