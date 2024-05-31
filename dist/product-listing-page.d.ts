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
    static export(): {
        ProductListingPage: {
            new: (requestState: any, responseState: any) => {
                getQuery: () => void;
                getQueryVariables: () => void;
                formatResponse: (requestOptions: any, shopifyResponse: any) => void;
                getFilterInputs: (filtersFromResponse: any) => {};
                getDataForInitialRequest: (requestOptions: any) => void;
            };
        };
    };
}
export default ProductListingPage;
