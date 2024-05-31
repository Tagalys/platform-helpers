import ShopifyAPI from './lib/shopifyApi';
declare class SearchSuggestions {
    private requestState;
    private responseState;
    private queries;
    private graphqlResponseFormatter;
    constructor(requestState: any, responseState: any);
    getQuery(): string;
    getQueryVariables(): any;
    getMetafieldVariables(): {
        product_metafields: any;
    };
    getSearchableResourceType(resource: any): "COLLECTION" | "PRODUCT" | "PAGE" | "ARTICLE" | "QUERY";
    validateRequest(): {
        valid: boolean;
        message: string;
    };
    getResourcesToRequest(): string[];
    getSearchSuggestionsQuery: (resourcesToRequest: any) => string;
    formatResponse(_: any, shopifyResponse: any): any;
    apiClient(): ShopifyAPI;
    helpersToExpose(): {
        getQuery: () => string;
        getQueryVariables: () => any;
        formatResponse: (requestOptions: any, shopifyResponse: any) => any;
    };
    static export(): {
        SearchSuggestions: {
            new: (requestState: any, responseState: any) => {
                getQuery: () => string;
                getQueryVariables: () => any;
                formatResponse: (requestOptions: any, shopifyResponse: any) => any;
            };
        };
    };
}
export default SearchSuggestions;
