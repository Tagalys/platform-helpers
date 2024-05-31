import GraphqlQueries from './lib/graphql-queries'
import ShopifyAPI from './lib/shopifyApi'
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';

class Base{
  public requestState
  public responseState
  public queries
  public graphqlResponseFormatter;

  constructor(requestState, responseState) {
    this.requestState = requestState;
    this.responseState = responseState
    this.queries = new GraphqlQueries()
    this.graphqlResponseFormatter = new GraphqlResponseFormatter()
  }

  apiClient() {
    return new ShopifyAPI()
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

  getSortOptions(requestOptions, defaultSortOptions) {
    let sortOptions = (requestOptions.params.sort_options || defaultSortOptions )
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

  getQuery() {}
  getQueryVariables() { }
  formatResponse(requestOptions, shopifyResponse) { }
  getDataForInitialRequest(requestOptions) { }

  getFilterData(filtersResponse) {
    const filterInputs = GraphqlResponseFormatter.getFilterInputs(filtersResponse)
    const rangeFilter = filtersResponse.find((filter) => filter.type === "PRICE_RANGE")
    let price_ranges = {}
    if (rangeFilter) {
      price_ranges = JSON.parse(rangeFilter.values[0].input).price
    }

    let filtersForRequestParams = {}
    for (const [filterId, appliedFilterValues] of Object.entries(this.requestState.filters)) {
      // checkbox filter
      const appliedFilter = filtersResponse.find((filter) => filter.id === filterId)
      if (appliedFilter) {
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
}

export default Base