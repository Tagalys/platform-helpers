import { applyCurrencyConversion, METAFIELD_TYPES } from "./common";
import globalContext from "./global-context";

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

class TagalysToCommonResponseFormatter {
  formatDetail = (detail: any): any => {
    let formattedDetail : any= {}
    for(const key in detail){
      switch (key) {
        case "__id":
          formattedDetail.id = parseInt(detail.__id)
          break
        case "name":
          formattedDetail.title = detail.name
          break
        case "available":
          formattedDetail.available = detail.available
          break
        case "shopify_tags":
          formattedDetail.tags = this.formatTags(detail.shopify_tags)
          break
        case "variants":
          formattedDetail = {
            ...formattedDetail,
            variants: this.formatVariants(detail.variants),
            ...this.getOptionRelatedFields(detail),
            ...this.getPriceRelatedFields(detail)
          }
          break
        case "_vendor":
          formattedDetail.vendor = this.formatVendor(detail._vendor)
          break
        case "images":
          formattedDetail.images = this.formatImages(detail.images)
          break
        case "metafields":
          formattedDetail.metafields = this.formatMetafields(detail)
          break
        case "link":
          formattedDetail.handle = detail.link.split("/products/")[1]
          break
        case "introduced_at":
          formattedDetail.published_at = detail.introduced_at
          break
        case "media":
          const formattedImages = this.formatImages(detail.images)
          formattedDetail.featured_image = this.getFeaturedImage(formattedImages)
          formattedDetail.media = detail.media
        case "_product_type":
          formattedDetail.product_type = this.formatProductType(detail._product_type)
          break
        case "published_collections_on_online_store":
          formattedDetail.collections = detail.published_collections_on_online_store
          break
        default:
          // TODO:// CONSIDER TAGALYS CUSTOM FIELDS AND TAG SETS HERE
          break;
      }
    }
    return formattedDetail
  };

  formatImages(images) {
    return images.map((image) => {
      return {
        position: image.position,
        alt: image.alt,
        width: image.width,
        height: image.height,
        src: image.src,
      }
    })
  }

  getFeaturedImage(images) {
    if(images.length > 0){
      const featuredImage = images.find((image) => image.position === 1)
      return (featuredImage || null)
    }
    return null
  }


  formatTags(tags) {
    if (Array.isArray(tags)) {
      return tags
    }
    return tags.split(", ").sort()
  }

  formatVendor(_vendor) {
    if (Array.isArray(_vendor)) {
      return _vendor[0]
    }
    return _vendor
  }

  formatProductType(_product_type) {
    if (Array.isArray(_product_type)) {
      return _product_type[0]
    }
    return _product_type
  }

  formatMetafields(detail) {
    for (const namespace in detail.metafields) {
      for (const key in detail.metafields[namespace]) {
        if(globalContext.shopifyConfiguration.isMetafieldConfigured(namespace, key, "products")){
          if (detail.hasOwnProperty("_references")) {
            if (detail._references.metafields.hasOwnProperty(namespace) && detail._references.metafields[namespace].hasOwnProperty(key)) {
              const metafieldReference = detail._references.metafields[namespace][key]
              if (detail.metafields[namespace][key]['type'] === METAFIELD_TYPES.LIST_PRODUCT_REFERENCE) {
                detail.metafields[namespace][key]['value'] = metafieldReference.value.map((product_detail) => {
                  return this.formatDetail(product_detail)
                })
              }
              if (detail.metafields[namespace][key]['type'] === METAFIELD_TYPES.COLLECTION_REFERENCE) {
                detail.metafields[namespace][key]['value'] = {
                  id: parseInt(metafieldReference.value.id),
                  title: metafieldReference.value.name,
                  handle: metafieldReference.value.slug,
                  products: metafieldReference.value.product_details.map((product_detail) => {
                    return this.formatDetail(product_detail)
                  })
                }
              }
            }
          }else{
            // SECOND LEVEL
            if (detail.metafields[namespace][key]['type'] === METAFIELD_TYPES.COLLECTION_REFERENCE) {
              detail.metafields[namespace][key]['id'] = parseInt(detail.metafields[namespace][key]['value'][0])
              delete detail.metafields[namespace][key]['value']
            }
            if (detail.metafields[namespace][key]['type'] === METAFIELD_TYPES.LIST_PRODUCT_REFERENCE) {
              detail.metafields[namespace][key]['ids'] = detail.metafields[namespace][key]['value'].map((value)=>parseInt(value))
              delete detail.metafields[namespace][key]['value']
            }
          }
          if (detail.metafields[namespace][key]['type'] === METAFIELD_TYPES.SINGLE_LINE_TEXT_FIELD) {
            // if the value is an array, return 0th element, else return the value
            if(Array.isArray(detail.metafields[namespace][key]['value'])){
              detail.metafields[namespace][key]['value'] = detail.metafields[namespace][key]['value'][0]
            } else {
              detail.metafields[namespace][key]['value'] = detail.metafields[namespace][key]['value']
            }
          }
        }else{
          delete detail.metafields[namespace][key]
          if(Object.keys(detail.metafields[namespace]).length === 0){
            delete detail.metafields[namespace]
          }
        }
      }
    }
    return detail.metafields
  }

  getPriceRelatedFields(detail) {

    const variantCompareAtPrices = detail.variants.filter((variant) => variant.compare_at_price !== null).map(variant => variant.compare_at_price)
    const variantPrices = detail.variants.filter((variant) => variant.price !== null).map(variant => variant.price)
    const price = detail.sale_price
    const compareAtPrice = variantCompareAtPrices.length > 0 ? Math.min(...variantCompareAtPrices) : null
    const priceMin = Math.min(...variantPrices)
    const priceMax = Math.max(...variantPrices)
    const compareAtPriceMin = Math.min(...variantCompareAtPrices)
    const compareAtPriceMax = Math.max(...variantCompareAtPrices)
    const priceVaries = variantPrices.filter(unique).length > 1
    const compareAtPriceVaries = variantCompareAtPrices.filter(unique).length > 1

    return {
      price_varies: priceVaries,
      compare_at_price_varies: compareAtPriceVaries,
      price: price ? applyCurrencyConversion(price) : null,
      compare_at_price: compareAtPrice ? applyCurrencyConversion(compareAtPrice) : null,
      price_min: applyCurrencyConversion(priceMin),
      price_max: applyCurrencyConversion(priceMax),
      compare_at_price_min: applyCurrencyConversion(compareAtPriceMin),
      compare_at_price_max: applyCurrencyConversion(compareAtPriceMax)
    }
  }

  getOptionRelatedFields(detail) {
    let optionRelatedFields = {}
    if (detail.hasOwnProperty('variants') && detail.hasOwnProperty('options')) {
      const options = detail.options.map((option) => option.name)
      optionRelatedFields['options'] = options
      optionRelatedFields['options_with_values'] = detail.options.map((option) => {
        return {
          name: option.name,
          position: option.position,
          values: option.values
        }
      })
      optionRelatedFields['has_only_default_variant'] = this.hasOnlyDefaultVariant(options, detail.variants)
    }
    return optionRelatedFields
  }

  formatVariants(variants) {
    if (variants && variants.length) { // confirm
      return variants.map((variant) => {
        if (variant.price) {
          variant.price = applyCurrencyConversion(variant.price)
        }
        if (variant.compare_at_price) {
          variant.compare_at_price = applyCurrencyConversion(variant.compare_at_price)
        }
        const { position, ...variantObject } = variant
        return variantObject
      })
    }
    return []
  }


  hasOnlyDefaultVariant(options, variants) {
    if (options.length > 1) {
      return false
    }
    if (variants.length > 1) {
      return false
    }
    if (options[0] === 'Title' && variants[0].option1 === 'Default Title' && variants[0].option2 === null && variants[0].option3 === null) {
      return true
    }
    return false
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