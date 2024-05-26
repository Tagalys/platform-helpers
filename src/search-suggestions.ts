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

  getQuery() {
    const { valid, message } = this.validateRequest();
    if (!valid) {
      throw new Error(message)
    }

    const resourcesToRequest = this.getResourcesToRequest()
    const query = this.getSearchSuggestionsQuery(resourcesToRequest)
    const isProductRequested = resourcesToRequest.includes('products')
    const isSearchableFieldsProvided = (this.requestState.params?.searchableFields?.length > 0)

    return `
      query SearchSuggestions(
        $query: String!,
        $types: [PredictiveSearchType!],
        ${isProductRequested ? '$product_metafields: [HasMetafieldsIdentifier!]!' : ''},
        ${isSearchableFieldsProvided ? "$searchableFields: '[SearchableField!]" : ''}
      ) @inContext(
          country: ${globalContext.configuration.getCountryCode()},
          language: ${globalContext.configuration.getLanguageCode()}
        ){
        predictiveSearch(
          query: $query,
          limitScope: EACH,
          limit: 10,
          unavailableProducts: ${this.requestState.params.unavailableProducts},
          ${isSearchableFieldsProvided ? `searchableFields: $searchableFields` : ''},
          types: $types
        ){
          ${query}
        }
      }
    `
  }

  getQueryVariables() {
    let queryVariables: any = {
      query: `${this.requestState.params.query}`,
      types: this.getResourcesToRequest().map(resource => this.getSearchableResourceType(resource)),
      ...this.getMetafieldVariables()
    }
    if (this.requestState.params?.searchableFields?.length > 0) {
      queryVariables.searchableFields = this.requestState.params.searchableFields
    }
    return queryVariables
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

  getSearchableResourceType(resource) {
    switch (resource) {
      case 'collections':
        return 'COLLECTION'
      case 'products':
        return 'PRODUCT'
      case 'pages':
        return 'PAGE'
      case 'articles':
        return 'ARTICLE'
      case 'queries':
        return 'QUERY'
    }
  }

  validateRequest() {
    // validate only queries, collections, products, pages, articles are requested
    const allowedResources = ['queries', 'collections', 'products', 'pages', 'articles'];
    const requestedResources = this.getResourcesToRequest();
    const hasRequestedAllowedTypes = requestedResources.every(type => allowedResources.includes(type));
    return {
      valid: hasRequestedAllowedTypes,
      message: hasRequestedAllowedTypes ? '' : `Invalid request type requested, allowed types are ${allowedResources.join(', ')}`
    };
  }

  getResourcesToRequest() {
    return Object.keys(this.requestState.params.request)
  }

  getSearchSuggestionsQuery = (resourcesToRequest) => {
    let query = ''
    if (resourcesToRequest.includes('queries')) {
      query += `
        queries {
          text
        }
      `
    }
    if (resourcesToRequest.includes('collections')) {
      query += `
        collections {
          id
          title
          onlineStoreUrl
        }
      `
    }
    if (resourcesToRequest.includes('products')) {
      query += `
        products {
          ${this.queries.getProductDetails()}
        }
      `
    }
    if (resourcesToRequest.includes('pages')) {
      query += `
        pages {
          id
          title
          onlineStoreUrl
        }
      `
    }
    if (resourcesToRequest.includes('articles')) {
      query += `
        articles {
          id
          title
          onlineStoreUrl
        }
      `
    }
    return query
  }

  formatResponse(_, shopifyResponse) {
    const response: any = {
      queries: [],
      products: [],
    };
    const shopifyResponseData = shopifyResponse.predictiveSearch;
    const resourcesToRequest = this.getResourcesToRequest();

    resourcesToRequest.forEach(resource => {
      const limit = this.requestState.params.request[resource].limit;

      switch (resource) {
        case "queries": {
          const thisSection = {
            section_id: "queries",
            section_title: "Queries",
            items: shopifyResponseData.queries.slice(0, limit).map(query => ({
              displayString: query.text,
              queryString: `${this.requestState.queryStringConfiguration.queryParameter}=${query.text}`,
            })),
          };
          response.queries.push(thisSection);
          break;
        }
        case "collections": {
          const thisSection = {
            section_id: "collections",
            section_title: "Collections",
            items: shopifyResponseData.collections.slice(0, limit).map(collection => ({
              displayString: collection.title,
              link: collection.onlineStoreURL,
            })),
          };
          response.queries.push(thisSection);
          break;
        }
        case "pages": {
          const thisSection = {
            section_id: "pages",
            section_title: "Pages",
            items: shopifyResponseData.pages.slice(0, limit).map(page => ({
              displayString: page.title,
              link: page.onlineStoreUrl,
            })),
          };
          response.queries.push(thisSection);
          break;
        }
        case "articles": {
          const thisSection = {
            section_id: "articles",
            section_title: "Articles",
            items: shopifyResponseData.articles.slice(0, limit).map(article => ({
              displayString: article.title,
              link: article.onlineStoreUrl,
            })),
          };
          response.queries.push(thisSection);
          break;
        }
        case "products": {
          response.products = shopifyResponseData.products.slice(0, limit).map(product =>
            this.graphqlResponseFormatter.formatProduct(product)
          );
          break;
        }
        default:
          break;
      }
    });

    return response;
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