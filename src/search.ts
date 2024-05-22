import { API_VERSION } from './lib/common';
import GraphqlQueries from './lib/graphql-queries'
import ShopifyAPI from './lib/shopifyApi'
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';

const DEFAULT_SORT_OPTIONS = [
  {
    "id": "manual",
    "label": "Featured"
  },
  {
    "id": "best-selling",
    "label": "Best selling",
  },
  {
    "id": "title-asc",
    "label": "Alphabetically, A-Z",
  },
  {
    "id": "title-desc",
    "label": "Alphabetically, Z-A",
  },
  {
    "id": "price-asc",
    "label": "Price, low to high"
  },
  {
    "id": "price-desc",
    "label": "Price, high to low"
  },
  {
    "id": "created-asc",
    "label": "Date, old to new"
  },
  {
    "id": "created-desc",
    "label": "Date, new to old"
  }
]

class Search {
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

  getSortVariables() {
    const sortOptionToSortKeyMap = {
      'manual': {
        sortKey: "MANUAL",
        reverse: false
      },
      'best-selling': {
        sortKey: "BEST_SELLING",
        reverse: false
      },
      'created-desc': {
        sortKey: 'CREATED',
        reverse: true
      },
      'created-asc': {
        sortKey: 'CREATED',
        reverse: false
      },
      'price-desc': {
        sortKey: 'PRICE',
        reverse: true,
      },
      'price-asc': {
        sortKey: 'PRICE',
        reverse: false
      },
      'title-asc': {
        sortKey: 'TITLE',
        reverse: false
      },
      'title-desc': {
        sortKey: 'TITLE',
        reverse: true
      },
      'id': {
        sortKey: 'ID',
        reverse: false
      },
      'collection-default': {
        sortKey: 'COLLECTION_DEFAULT',
        reverse: false
      }
    }
    return sortOptionToSortKeyMap[this.requestState.sort]
  }

  getPaginationVariables() {
    let paginationVariables = {}
    if (this.requestState.endCursor) {
      paginationVariables['after'] = this.requestState.endCursor
      paginationVariables['first'] = this.requestState.perPage
    }
    if (this.requestState.startCursor) {
      paginationVariables['before'] = this.requestState.startCursor
      paginationVariables['last'] = this.requestState.perPage
    }
    if (!this.requestState.startCursor && !this.requestState.endCursor) {
      paginationVariables['first'] = this.requestState.perPage
    }
    return paginationVariables
  }

  getFilterVariables() {
    let filterVariables = {}
    if (Object.keys(this.requestState.filters).length) {
      let filtersToApply = []
      for (const [_, filterValues] of Object.entries(this.requestState.filters)) {
        const values: any = filterValues
        if (filterValues.hasOwnProperty("selected_min")) {
          filtersToApply.push({
            price: {
              min: parseFloat(filterValues['selected_min']),
              max: parseFloat(filterValues['selected_max'])
            }
          })
        } else {
          values.forEach((filterValue) => {
            if (this.responseState.filter_inputs && this.responseState.filter_inputs[filterValue]) {
              const selectedFilterValue = this.responseState.filter_inputs[filterValue]
              filtersToApply.push(JSON.parse(selectedFilterValue.input))
            }
          })
        }
      }
      filterVariables['filters'] = filtersToApply
    }
    return filterVariables
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
      query: `${this.requestState.query}`,
      ...this.getSortVariables(),
      ...this.getPaginationVariables(),
      ...this.getFilterVariables(),
      ...this.getMetafieldVariables()
    }
  }

  getQuery() {
    return `
      query Search(
        $query: String!,
        $first: Int,
        $last: Int,
        $before: String,
        $after: String,
        $reverse: Boolean,
        $product_metafields: [HasMetafieldsIdentifier!]!,
      ) @inContext(
          country: ${globalContext.configuration.getCountryCode()},
          language: ${globalContext.configuration.getLanguageCode()}
        ) {
        search(query: $query, first: $first, last: $last, after: $after, before: $before,  reverse: $reverse){
          edges{
            node{
              ... on Product{
                ${this.queries.getProductDetails()}
              }
            }
          }
          productFilters {
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

  static getFilterInputsQuery() {
    return `
    query Search(
      $query: String!,
    ) {
      search(query: $query, first: 1){
        productFilters {
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

  getRequestOptions() {
    return {
      path: "graphql.json",
      apiVersion: API_VERSION
    }
  }

  getSortOptions(requestOptions) {
    let sortOptions = (requestOptions.params.sort_options || DEFAULT_SORT_OPTIONS )
    sortOptions.forEach((sortOption: any) => {
      if (sortOption.id === this.requestState.sort) {
        sortOption.selected = true
      }else{
        sortOption.selected = false
      }
    })
    if(this.requestState.sort === null && sortOptions.length > 0){
      sortOptions[0].selected = true
    }
    return sortOptions
  }

  formatResponse(requestOptions, shopifyResponse) {
    return {
      products: shopifyResponse.search.edges.map((productEdge) => this.graphqlResponseFormatter.formatProduct(productEdge.node)),
      filters: this.graphqlResponseFormatter.formatFilters(shopifyResponse.search.productFilters, this.requestState.filters, this.responseState.price_ranges),
      sort_options: this.getSortOptions(requestOptions),
      page_info: shopifyResponse.search.pageInfo,
      filter_inputs: GraphqlResponseFormatter.getFilterInputs(shopifyResponse.search.productFilters)
    }
  }

  apiClient() {
    return new ShopifyAPI()
  }

  async getDataForInitialRequest(requestOptions) {
    const filterInputsQuery = Search.getFilterInputsQuery()
    const response = await this.apiClient().call("POST", "graphql.json", {
      params: JSON.stringify({
        query: filterInputsQuery,
        variables: {
          query: `${this.requestState.query}`,
        }
      })
    })
    const filterInputs = GraphqlResponseFormatter.getFilterInputs(response.search.productFilters)
    const rangeFilter = response.search.productFilters.find((filter) => filter.type === "PRICE_RANGE")
    let price_ranges = {}
    if (rangeFilter) {
      price_ranges = JSON.parse(rangeFilter.values[0].input).price
    }


    let filtersForRequestParams = {}
    for (const [filterId, appliedFilterValues] of Object.entries(this.requestState.filters)) {
      // checkbox filter
      const appliedFilter = response.search.productFilters.find((filter) => filter.id === filterId)
      if (Array.isArray(appliedFilterValues)) {
        let formattedFilterValues = []
        appliedFilterValues.forEach((filterLabel) => {
          if (appliedFilter.type === "LIST" || appliedFilter.type === "BOOLEAN") {
            appliedFilter.values.forEach((filterValue) => {
              if (filterLabel === filterValue.label) {
                formattedFilterValues.push(filterValue.id)
              }
            })
          }
        })
        filtersForRequestParams[filterId] = formattedFilterValues
      } else {
        filtersForRequestParams[filterId] = appliedFilterValues
      }
    }

    return {
      filtersForRequestParams: filtersForRequestParams,
      filter_inputs: filterInputs,
      price_ranges: price_ranges
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