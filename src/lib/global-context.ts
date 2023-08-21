class GlobalContext{
  public configuration
  public shopifyConfiguration
   
  set(opts){
    this.configuration = opts.configuration
    this.shopifyConfiguration = opts.shopifyConfiguration
  }

  getConfiguration(){
    return this.configuration
  }

  getShopifyConfiguration(){
    return this.shopifyConfiguration
  }

}

export default new GlobalContext()