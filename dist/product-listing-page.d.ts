import Base from './product-listing-page-base';
declare class ProductListingPage extends Base {
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
        name: any;
        products: any;
        filters: any;
        sort_options: any;
        page_info: any;
        filter_inputs: {};
    };
    helpersToExpose(): {
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
    static export(): {
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
    };
}
export default ProductListingPage;
