import Base from "./product-listing-page-base";
declare class Search extends Base {
    getQuery(): string;
    getQueryVariables(): any;
    getSortVariables(): any;
    static getFilterInputsQuery(): string;
    getDataForInitialRequest(requestOptions: any): Promise<{
        filtersForRequestParams: {};
        filter_inputs: {};
        price_ranges: {};
    }>;
    formatResponse(requestOptions: any, shopifyResponse: any): {
        query: any;
        products: any;
        filters: any;
        sort_options: any;
        page_info: any;
        filter_inputs: {};
        total: any;
    };
    helpersToExpose(): {
        getQuery: () => string;
        getQueryVariables: () => any;
        formatResponse: (requestOptions: any, shopifyResponse: any) => {
            query: any;
            products: any;
            filters: any;
            sort_options: any;
            page_info: any;
            filter_inputs: {};
            total: any;
        };
        getFilterInputs: (filtersFromResponse: any) => {};
        getDataForInitialRequest: (requestOptions: any) => Promise<{
            filtersForRequestParams: {};
            filter_inputs: {};
            price_ranges: {};
        }>;
    };
    static export(): {
        Search: {
            new: (requestState: any, responseState: any) => {
                getQuery: () => string;
                getQueryVariables: () => any;
                formatResponse: (requestOptions: any, shopifyResponse: any) => {
                    query: any;
                    products: any;
                    filters: any;
                    sort_options: any;
                    page_info: any;
                    filter_inputs: {};
                    total: any;
                };
                getFilterInputs: (filtersFromResponse: any) => {};
                getDataForInitialRequest: (requestOptions: any) => Promise<{
                    filtersForRequestParams: {};
                    filter_inputs: {};
                    price_ranges: {};
                }>;
            };
        };
    };
}
export default Search;
