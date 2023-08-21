import TagalysToCommonResponseFormatter from "./lib/tagalys-to-common-response-formatter";
import ProductListingPage from "./product-listing-page";
import MultiMarket from './lib/multi-market'
import ShopifyAPI from "./lib/shopifyApi";
import globalContext from "./lib/global-context";

export default {
  globalContext: {
    set: (opts) => globalContext.set(opts),
    getConfiguration: () => globalContext.getConfiguration(),
    getShopifyConfiguration: () => globalContext.getShopifyConfiguration(),
  },
  apiClient: () => new ShopifyAPI(),
  ...TagalysToCommonResponseFormatter.export(),
  ...ProductListingPage.export(),
  ...MultiMarket.export()
}