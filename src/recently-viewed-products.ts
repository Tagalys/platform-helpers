import GraphqlQueries from './lib/graphql-queries';
import ShopifyAPI from './lib/shopifyApi';
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';

class RecentViewedProducts {
  private queries: GraphqlQueries;
  private graphqlResponseFormatter: GraphqlResponseFormatter;

  constructor(requestState: any, responseState: any) {
    this.queries = new GraphqlQueries();
    this.graphqlResponseFormatter = new GraphqlResponseFormatter();
  }

  private formatProductGids(productIds: string[]): string[] {
    return productIds.map(id => `gid://shopify/Product/${id}`);
  }

  getMetafieldVariables(): { product_metafields: any[] } {
    if (!globalContext.shopifyConfiguration.hasMetafields()) {
      return { product_metafields: [] };
    }
    const metafieldsToQuery = globalContext.shopifyConfiguration.getMetafields();
    return {
      product_metafields: (metafieldsToQuery.products || []),
    };
  }

  getQuery(): string {
    const languageCode = globalContext.configuration.getLanguageCode();
    return `
      query GetProductsByIds(
        $ids: [ID!]!,
        $product_metafields: [HasMetafieldsIdentifier!]!
      ) @inContext(
          country: ${globalContext.configuration.getCountryCode()},
          ${languageCode ? `language: ${languageCode}` : ''}
        ) {
        nodes(ids: $ids) {
          ... on Product {
            ${this.queries.getProductDetails()}
          }
        }
      }
    `;
  }

  // --- GraphQL Query Variables ---
  getQueryVariables(productIds) {
    return {
      ids: this.formatProductGids(productIds),
      ...this.getMetafieldVariables()
    };
  }

  formatResponse(_: any, shopifyResponse: any): { products: any[] } {
    const products = shopifyResponse.nodes
      .filter(node => node !== null)
      .map(node => this.graphqlResponseFormatter.formatProduct(node));
    return { products: products };
  }

  helpersToExpose(): object {
    return {
      getQuery: () => this.getQuery(),
      getQueryVariables: (productIds) => this.getQueryVariables(productIds),
      formatResponse: (requestOptions, shopifyResponse) => this.formatResponse(requestOptions, shopifyResponse),
    };
  }

  static export() {
    return {
      RecentlyViewedProducts: {
        new: (requestState, responseState) => {
          const instance = new this(requestState, responseState);
          return instance.helpersToExpose();
        }
      }
    };
  }
}

export default RecentViewedProducts;