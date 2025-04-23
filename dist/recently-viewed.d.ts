import ShopifyAPI from './lib/shopifyApi';
declare class RecentViewed {
    private requestState;
    private responseState;
    private queries;
    private graphqlResponseFormatter;
    constructor(requestState: {
        productIds: string[];
    }, responseState: any);
    apiClient(): ShopifyAPI;
    private formatProductGids;
    getMetafieldVariables(): {
        product_metafields: any[];
    };
    getQuery(): string;
    getQueryVariables(): object;
    formatResponse(_: any, shopifyResponse: any): {
        products: any[];
    };
    helpersToExpose(): object;
    static export(): object;
}
export default RecentViewed;
