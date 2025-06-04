import { applyCurrencyConversion, METAFIELD_TYPES } from "./common";
import globalContext from "./global-context";

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

class TagalysToCommonResponseFormatter {
  formatDetail = (detail: any): any => {
    return {
      ...detail,
      metafields: this.formatMetafields(detail)
    }
  };

  formatMetafields(detail) {
    for (const namespace in detail.metafields) {
      for (const key in detail.metafields[namespace]) {
        const isConfigured = globalContext.shopifyConfiguration.isMetafieldConfigured(namespace, key, "products")
        if(isConfigured){
          delete detail.metafields[namespace][key]
          if(Object.keys(detail.metafields[namespace]).length === 0){
            delete detail.metafields[namespace]
          }
        }
      }
    }
    return detail.metafields
  }


  helpersToExpose(){
    return {
      formatDetail: (detail) => this.formatDetail(detail)
    }
  }

  static export() {
    return {
      TagalysToCommonResponseFormatter: {
        new: () => {
          const instance = new this()
          return instance.helpersToExpose()
        }
      }
    }
  }
}

export default TagalysToCommonResponseFormatter;