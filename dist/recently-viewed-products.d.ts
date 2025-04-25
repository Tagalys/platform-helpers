import ShopifyAPI from './lib/shopifyApi';
declare class RecentViewedProducts {
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
    getQueryVariables(): {
        product_metafields: any[];
        ids: string[];
    };
    formatResponse(_: any, shopifyResponse: any): {
        products: any[];
    };
    helpersToExpose(): object;
    static export(): {
        RecentlyViewedProducts: {
            new: (requestState: any, responseState: any) => object;
        };
    };
}
export default RecentViewedProducts;
