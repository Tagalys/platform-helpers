import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';
import Base from "./product-listing-page-base"

const DEFAULT_SORT_OPTIONS = [
  {
    "id": "relevance",
    "label": "Relevance"
  },
  {
    "id": "price-asc",
    "label": "Price, low to high"
  },
  {
    "id": "price-desc",
    "label": "Price, high to low"
  }
]

class Search extends Base{

  getQuery() {
    return `
      query Search(
        $query: String!,
        $first: Int,
        $last: Int,
        $before: String,
        $after: String,
        $sortKey: SearchSortKeys,
        $reverse: Boolean,
        $filters:  [ProductFilter!],
        $product_metafields: [HasMetafieldsIdentifier!]!,
        $prefix: SearchPrefixQueryType,
        $unavailableProducts: SearchUnavailableProductsType,
        $types: [SearchType!]
      ) @inContext(
          country: ${globalContext.configuration.getCountryCode()},
          language: ${globalContext.configuration.getLanguageCode()}
        ) {
        search(
          query: $query,
          first: $first,
          last: $last,
          after: $after,
          before: $before,
          reverse: $reverse,
          sortKey: $sortKey,
          productFilters: $filters,
          prefix: $prefix,
          unavailableProducts: $unavailableProducts,
          types: $types,
        ){
          totalCount
          edges{
            node{
              ... on Product{
                ${this.queries.getProductDetails()}
              }
            }
          }
          filters: productFilters {
            id
            label
            type
            values {
              id
              label
              count
              input
            }
          }
          pageInfo{
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `
  }

  getQueryVariables() {
    return {
      query: `${this.requestState.query}`,
      unavailableProducts: this.requestState.unavailableProducts,
      prefix: this.requestState.prefix,
      types: this.requestState.types,
      ...this.getSortVariables(),
      ...this.getPaginationVariables(),
      ...this.getFilterVariables(),
      ...this.getMetafieldVariables()
    }
  }

  getSortVariables() {
    // for sort option id, refer DEFAULT_SORT_OPTIONS
    const sortOptionIdToSortKeyMap = {
      'relevance': {
        sortKey: 'RELEVANCE',
        reverse: false,
      },
      'price-desc': {
        sortKey: 'PRICE',
        reverse: true,
      },
      'price-asc': {
        sortKey: 'PRICE',
        reverse: false
      }
    }
    return sortOptionIdToSortKeyMap[this.requestState.sort]
  }

  static getFilterInputsQuery() {
    return `
    query Search(
      $query: String!,
    ) {
      search(query: $query, first: 1){
        filters: productFilters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
    `
  }

  async getDataForInitialRequest(requestOptions) {
    const filterInputsQuery = Search.getFilterInputsQuery();
    const response = await this.apiClient().call("POST", "graphql.json", {
      params: JSON.stringify({
        query: filterInputsQuery,
        variables: {
          query: `${this.requestState.query}`,
        }
      })
    })
    return this.getFilterData(response.search.filters)
  }

  formatResponse(requestOptions, shopifyResponse) {
    // handle empty node: {}
    return {
      query: this.requestState.query,
      products: shopifyResponse.search.edges.map((productEdge) => this.graphqlResponseFormatter.formatProduct(productEdge.node)),
      filters: this.graphqlResponseFormatter.formatFilters(shopifyResponse.search.filters, this.requestState.filters, this.responseState.price_ranges),
      sort_options: this.getSortOptions(requestOptions, DEFAULT_SORT_OPTIONS),
      page_info: shopifyResponse.search.pageInfo,
      filter_inputs: GraphqlResponseFormatter.getFilterInputs(shopifyResponse.search.filters),
      total: shopifyResponse.search.totalCount,
    }
  }

  helpersToExpose() {
    return {
      getQuery: () => this.getQuery(),
      getQueryVariables: () => this.getQueryVariables(),
      formatResponse: (requestOptions, shopifyResponse) => this.formatResponse(requestOptions, shopifyResponse),
      getFilterInputs: (filtersFromResponse) => GraphqlResponseFormatter.getFilterInputs(filtersFromResponse),
      getDataForInitialRequest: (requestOptions) => this.getDataForInitialRequest(requestOptions),
    }
  }

  static export() {
    return {
      Search: {
        new: (requestState, responseState) => {
          const instance = new this(requestState, responseState)
          return instance.helpersToExpose()
        }
      }
    }
  }
}

export default Search