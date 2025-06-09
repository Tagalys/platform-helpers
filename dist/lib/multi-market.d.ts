declare class MultiMarket {
    getProductDetailsForMarket(productIds: any): Promise<{}>;
    getMarketSpecificDetails(product: any): {
        productId: number;
        metafields: {};
        price: number;
        compare_at_price: number;
        price_varies: boolean;
        compare_at_price_varies: boolean;
        price_min: number;
        price_max: number;
        compare_at_price_min: number;
        compare_at_price_max: number;
        variantPricesMap: {};
    };
    getMetafieldValue(metafield: any): any;
    updateProductDetailsForMarket(products: any): Promise<any>;
    mutateProductDetails(product: any, marketSpecificProductDetails: any): void;
    updateMetafieldPrices(metafields: any, marketSpecificMetafields: any): void;
    idPresentInGivenList(ListOfIds: any, id: any): boolean;
    updateCollectionReferenceMetafield(data: any, marketSpecificValue: any): void;
    updateProductListReferenceMetafield(data: any, marketSpecificValue: any): void;
    resetProductPrices(products: any): any;
    resetProductPrice(product: any): void;
    resetMetafieldPrices(metafields: any): void;
    helpersToExpose(): {
        updateProductDetailsForMarket: (products: any) => Promise<any>;
        resetProductPrices: (products: any) => any;
    };
    static export(): {
        MultiMarket: {
            new: () => {
                updateProductDetailsForMarket: (products: any) => Promise<any>;
                resetProductPrices: (products: any) => any;
            };
        };
    };
}
export default MultiMarket;
