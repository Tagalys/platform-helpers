import GraphqlQueries from './lib/graphql-queries'
import GraphqlResponseFormatter from './lib/grapqhl-to-common-response-formatter';
import globalContext from './lib/global-context';
import Base from './product-listing-page-base'

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

class ProductListingPage extends Base{

  getQuery() {
    return `
      query Collection(
        $id: ID,
        $first: Int,
        $last: Int,
        $before: String,
        $after: String,
        $sortKey: ProductCollectionSortKeys,
        $reverse: Boolean,
        $filters: [ProductFilter!],
        $product_metafields: [HasMetafieldsIdentifier!]!,
      ) @inContext(country: ${globalContext.configuration.getCountryCode()}) {
        collection(id: $id){
          title
          handle
          products(first: $first, last: $last, after: $after, before: $before, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
            filters {
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
            edges{
              node{
                ${this.queries.getProductDetails()}
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
      }
    `
  }

  getQueryVariables() {
    return {
      id: `gid://shopify/Collection/${this.requestState.product_listing_page_id}`,
      ...this.getSortVariables(),
      ...this.getPaginationVariables(),
      ...this.getFilterVariables(),
      ...this.getMetafieldVariables()
    }
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

  static getFilterInputsQuery() {
    return `
    query Collection(
      $id: ID,
    ) {
      collection(id: $id){
        products(first: 1) {
          ${GraphqlQueries.getFilters()}
        }
      }
    }
    `
  }

  async getDataForInitialRequest(requestOptions) {
    const filterInputsQuery = ProductListingPage.getFilterInputsQuery()
    const response = await this.apiClient().call("POST", "graphql.json", {
      params: JSON.stringify({
        query: filterInputsQuery,
        variables: {
          id: `gid://shopify/Collection/${requestOptions.params.product_listing_page_id}`
        }
      })
    })
    return this.getFilterData(response.collection.products.filters)
  }

  formatResponse(requestOptions, shopifyResponse) {
    return {
      name: shopifyResponse.collection.title,
      products: this.graphqlResponseFormatter.formatProducts(shopifyResponse.collection.products),
      filters: this.graphqlResponseFormatter.formatFilters(shopifyResponse.collection.products.filters, this.requestState.filters, this.responseState.price_ranges),
      sort_options: this.getSortOptions(requestOptions, DEFAULT_SORT_OPTIONS),
      page_info: shopifyResponse.collection.products.pageInfo,
      filter_inputs: GraphqlResponseFormatter.getFilterInputs(shopifyResponse.collection.products.filters)
    }
  }

  static export() {
    return {
      ProductListingPage: {
        new: (requestState, responseState) => {
          const instance = new this(requestState, responseState)
          return instance.helpersToExpose()
        }
      }
    }
  }
}

export default ProductListingPage