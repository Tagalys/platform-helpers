declare class RecentViewedProducts {
    private queries;
    private graphqlResponseFormatter;
    constructor(requestState: any, responseState: any);
    private formatProductGids;
    getMetafieldVariables(): {
        product_metafields: any[];
    };
    getQuery(): string;
    getQueryVariables(productIds: any): {
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
