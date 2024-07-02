declare class LanguageTranslation {
    productIds: any;
    constructor(productIds: any);
    translate(): Promise<any>;
    getQuery(): string;
    getQueryVariables(): {
        product_metafields: any;
    };
}
export default LanguageTranslation;
