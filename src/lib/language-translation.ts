import { API_VERSION, getIdFromGraphqlId, getMetafieldsToQuery } from "./common";
import globalContext from "./global-context";
import GraphqlQueries from "./graphql-queries";
import GraphqlResponseFormatter from "./grapqhl-to-common-response-formatter";

class LanguageTranslation{
  public productIds
  constructor(productIds) {
    this.productIds = productIds.map(
      (productId) => `gid://shopify/Product/${productId}`
    );
  }

  async translate() {
    const response = await fetch(
      `https://${globalContext.shopifyConfiguration.getMyShopifyDomain()}/api/${API_VERSION}/graphql.json`,
      {
        body: JSON.stringify({
          query: this.getQuery(),
          variables: this.getQueryVariables(),
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": globalContext.shopifyConfiguration.getStorefrontAPIAccessToken(),
        },
        method: "POST",
      }
    );
    const responseJson = await response.json();
    const graphqlResponseFormatter = new GraphqlResponseFormatter();
    // product is null, if the product is not published to the storefront app
    return responseJson.data.nodes.filter((product, index) => {
      if (product === null) {
        console.warn(`Product with id: ${getIdFromGraphqlId(this.productIds[index])} is not published to the storefront app`);
      }
      return product !== null;
    }).map((product) =>
      graphqlResponseFormatter.formatProduct(product)
    );
  }

  getQuery() {
    const productDetailsQuery = new GraphqlQueries().getProductDetails();
    const countryContextQuery = `country: ${globalContext.configuration.getCountryCode()}`;
    const languageContextQuery = `language: ${globalContext.configuration.getLanguageCode()}`

    return `query allProducts($product_metafields: [HasMetafieldsIdentifier!]!) @inContext(${countryContextQuery}, ${languageContextQuery}) {
      nodes(ids: ${JSON.stringify(this.productIds)}){
        ... on Product{
          ${productDetailsQuery}
        }
      }
    }`
  }

  getQueryVariables() {
    return getMetafieldsToQuery()
  }
}

export default LanguageTranslation