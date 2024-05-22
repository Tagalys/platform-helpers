import ShopifyAPI from './lib/shopifyApi';
declare class SearchSuggestions {
    private requestState;
    private responseState;
    private queries;
    private graphqlResponseFormatter;
    constructor(requestState: any, responseState: any);
    getMetafieldVariables(): {
        product_metafields: any;
    };
    getQueryVariables(): {
        product_metafields: any;
        query: string;
    };
    validateRequest(): {
        valid: boolean;
        message: string;
    };
    getQuery(): string;
    getSearchSuggestionsQuery: (requestedTypes: any) => string;
    formatResponse(_: any, shopifyResponse: any): any;
    apiClient(): ShopifyAPI;
    helpersToExpose(): {
        getQuery: () => string;
        getQueryVariables: () => {
            product_metafields: any;
            query: string;
        };
        formatResponse: (requestOptions: any, shopifyResponse: any) => any;
    };
    static export(): {
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
    };
}
export default SearchSuggestions;
