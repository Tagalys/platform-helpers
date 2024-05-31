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
    getFilterData(filtersResponse: any): {
        filtersForRequestParams: {};
        filter_inputs: {};
        price_ranges: {};
    };
}
export default Base;
