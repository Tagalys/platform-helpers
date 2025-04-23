import GraphqlQueries from './lib/graphql-queries';
import ShopifyAPI from './lib/shopifyApi';
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';

class RecentViewed {
  private requestState: { productIds: string[] };
  private responseState: any;
  private queries: GraphqlQueries;
  private graphqlResponseFormatter: GraphqlResponseFormatter;

  constructor(requestState: { productIds: string[] }, responseState: any) {
    if (!requestState || !Array.isArray(requestState.productIds) || requestState.productIds.length === 0) {
      throw new Error("RecentViewed requires a non-empty 'productIds' array in requestState");
    }
    this.requestState = requestState;
    this.responseState = responseState;
    this.queries = new GraphqlQueries();
    this.graphqlResponseFormatter = new GraphqlResponseFormatter();
  }

  apiClient(): ShopifyAPI {
    return new ShopifyAPI();
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
  getQueryVariables(): object {
    return {
      ids: this.formatProductGids(this.requestState.productIds),
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
      getQueryVariables: () => this.getQueryVariables(),
      formatResponse: (requestOptions, shopifyResponse) => this.formatResponse(requestOptions, shopifyResponse),
    };
  }

  static export() {
    return {
      RecentlyViewed: {
        new: (requestState, responseState) => {
          const instance = new this(requestState, responseState);
          return instance.helpersToExpose();
        }
      }
    };
  }
}

export default RecentViewed;