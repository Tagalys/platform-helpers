import TagalysToCommonResponseFormatter from "./lib/tagalys-to-common-response-formatter";
import MultiMarket from './lib/multi-market'
import ShopifyAPI from "./lib/shopifyApi";
import globalContext from "./lib/global-context";
import ProductListingPage from "./product-listing-page";
import SearchSuggestions from "./search-suggestions";
import Search from "./search";

export default {
  globalContext: {
    set: (opts) => globalContext.set(opts),
    getConfiguration: () => globalContext.getConfiguration(),
    getShopifyConfiguration: () => globalContext.getShopifyConfiguration(),
  },
  apiClient: () => new ShopifyAPI(),
  ...TagalysToCommonResponseFormatter.export(),
  ...ProductListingPage.export(),
  ...SearchSuggestions.export(),
  ...Search.export(),
  ...MultiMarket.export()
}