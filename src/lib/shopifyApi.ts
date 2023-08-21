import { API_VERSION } from './common'
import globalContext from './global-context';

class ShopifyAPI{
  async call(method: string, path: string, requestOptions, headers = {}){
    const response = await fetch(this.url(path), {
      body: requestOptions.params,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Shopify-Storefront-Access-Token": globalContext.shopifyConfiguration.getStorefrontAPIAccessToken()
      },
      method: method,
    });
    if(response.status === 200){
      const parsedResponse = await response.json()
      if(requestOptions.hasOwnProperty("onSuccess")){
        return requestOptions.onSuccess(parsedResponse.data)
      }
      return parsedResponse.data
    }else{
      if(typeof(requestOptions.onFailure) != 'undefined') {
        return requestOptions.onFailure(response);
      }
      return response
    }
  }

  url(path): string{
    return `https://${globalContext.shopifyConfiguration.getMyShopifyDomain()}/api/${API_VERSION}/${path}`
  }
}

export default ShopifyAPI;