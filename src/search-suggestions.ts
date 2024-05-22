import GraphqlQueries from './lib/graphql-queries'
import ShopifyAPI from './lib/shopifyApi'
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';

class SearchSuggestions {
  private requestState
  private responseState
  private queries
  private graphqlResponseFormatter;

  constructor(requestState, responseState) {
    this.requestState = requestState;
    this.responseState = responseState
    this.queries = new GraphqlQueries()
    this.graphqlResponseFormatter = new GraphqlResponseFormatter()
  }

  getMetafieldVariables() {
    if (!globalContext.shopifyConfiguration.hasMetafields()) {
      return {
        product_metafields: [],
      }
    }
    const metafieldsToQuery = globalContext.shopifyConfiguration.getMetafields()
    return {
      product_metafields: (metafieldsToQuery.products || []),
    }
  }

  getQueryVariables() {
    return {
      query: `${this.requestState.params.query}`,
      ...this.getMetafieldVariables()
    }
  }

  validateRequest() {
    // validate only queries, collections, products, pages, articles are requested
    const allowedRequestTypes = ['queries', 'collections', 'products', 'pages', 'articles'];
    const requestedTypes = Object.keys(this.requestState.params.request)
    const hasRequestedAllowedTypes = requestedTypes.every(type => allowedRequestTypes.includes(type));
    return {
      valid: hasRequestedAllowedTypes,
      message: `Invalid request type requested, allowed types are ${allowedRequestTypes.join(', ')}`
    };
  }

  getQuery() {
    const { valid, message } = this.validateRequest();
    if (!valid) {
      throw new Error(message)
    }

    const requestedTypes = Object.keys(this.requestState.params.request)
    const query = this.getSearchSuggestionsQuery(requestedTypes)
    return `
      query SearchSuggestions(
        $query: String!,
        $product_metafields: [HasMetafieldsIdentifier!]!,
      ) @inContext(
          country: ${globalContext.configuration.getCountryCode()},
          language: ${globalContext.configuration.getLanguageCode()}
        ){
        predictiveSearch(query: $query, limitScope: EACH, limit: 10){
          ${query}
        }
      }
    `
  }

  getSearchSuggestionsQuery = (requestedTypes) => {
    let query = ''
    if (requestedTypes.includes('queries')) {
      query += `
        queries {
          text
        }
      `
    }
    if (requestedTypes.includes('collections')) {
      query += `
        collections {
          id
          title
          handle
          onlineStoreURL
        }
      `
    }
    if (requestedTypes.includes('products')) {
      query += `
        products {
          ${this.queries.getProductDetails()}
        }
      `
    }
    if (requestedTypes.includes('pages')) {
      query += `
        pages {
          id
          title
          handle
        }
      `
    }
    if (requestedTypes.includes('articles')) {
      query += `
        articles {
          id
          title
          authorV2{
            name
          }
          tags
          handle
        }
      `
    }
    return query
  }

  formatResponse(_, shopifyResponse) {
    let response: any = {
      queries: [],
      products: [],
    }
    const shopifyResponseData = shopifyResponse.predictiveSearch
    if (shopifyResponseData?.collections?.length > 0) {
      const thisSection = {
        section_id: "collections",
        section_title: "Collections",
        items: shopifyResponseData.collections.map((collection) => {
          return {
            displayString: collection.title,
            handle: collection.handle,
            url: collection.onlineStoreURL,
          }
        })
      }
      response.queries.push(thisSection)
    }
    if (shopifyResponseData?.pages?.length > 0) {
      const thisSection = {
        section_id: "pages",
        section_title: "Pages",
        items: shopifyResponseData.pages.map((page) => {
          return {
            displayString: page.title,
            handle: page.handle,
            url: page.onlineStoreURL,
          }
        })
      }
      response.queries.push(thisSection)
    }
    if (shopifyResponseData?.articles?.length > 0) {
      const thisSection = {
        section_id: "articles",
        section_title: "Articles",
        items: shopifyResponseData.articles.map((article) => {
          return {
            displayString: article.title,
            handle: article.handle,
            url: article.onlineStoreURL,
          }
        })
      }
      response.queries ||= []
      response.queries.push(thisSection)
    }
    if (shopifyResponseData?.products?.length > 0) {
      response.products = shopifyResponseData.products.map((product) => this.graphqlResponseFormatter.formatProduct(product))
    }
    // if (shopifyResponseData.queries) {
    //   response.queries = shopifyResponse.predictiveSearch.queries
    // }
    return response
    // return {
    //   name: shopifyResponse.collection.title,
    //   products: this.graphqlResponseFormatter.formatProducts(shopifyResponse.collection.products),
    // }
  }

  apiClient() {
    return new ShopifyAPI()
  }

  helpersToExpose() {
    return {
      getQuery: () => this.getQuery(),
      getQueryVariables: () => this.getQueryVariables(),
      formatResponse: (requestOptions, shopifyResponse) => this.formatResponse(requestOptions, shopifyResponse),
    }
  }

  static export() {
    return {
      SearchSuggestions: {
        new: (requestState, responseState) => {
          const instance = new this(requestState, responseState)
          return instance.helpersToExpose()
        }
      }
    }
  }
}

export default SearchSuggestions