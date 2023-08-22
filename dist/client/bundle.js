var TagalysPlatformHelpers;(()=>{"use strict";var e={607:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var a=n(521),i=n(125),o=n(92),c=n(89),s=n(192);t.default=r(r(r({globalContext:{set:function(e){return s.default.set(e)},getConfiguration:function(){return s.default.getConfiguration()},getShopifyConfiguration:function(){return s.default.getShopifyConfiguration()}},apiClient:function(){return new c.default}},a.default.export()),i.default.export()),o.default.export())},527:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getIdFromGraphqlId=t.METAFIELD_TYPES=t.API_VERSION=t.getPriceDetails=t.getMax=t.getMin=t.getProductPriceAndCompareAtPrice=t.getVariantCompareAtPrices=t.getVariantPrices=t.applyCurrencyConversion=t.unique=void 0;var r=n(192);t.unique=function(e,t,n){return n.indexOf(e)===t},t.applyCurrencyConversion=function(e){if(null!==e){var t=r.default.configuration.getExchangeRate(),n=r.default.configuration.getFractionalDigits(),a=e*t;return Math.round(a*Math.pow(10,n))/Math.pow(10,n)}return null},t.getVariantPrices=function(e){return e.filter((function(e){return null!==e.node.price})).map((function(e){return parseFloat(e.node.price.amount)}))},t.getVariantCompareAtPrices=function(e){return e.filter((function(e){return null!==e.node.compareAtPrice})).map((function(e){return parseFloat(e.node.compareAtPrice.amount)}))},t.getProductPriceAndCompareAtPrice=function(e){var n=e.map((function(e){return parseFloat(e.node.price.amount)})),r=e.map((function(e){var t=parseFloat(e.node.price.amount);if(e.node.compareAtPrice){var n=parseFloat(e.node.compareAtPrice.amount);if(n>t)return n}return t})),a=n.length>0?Math.min.apply(Math,n):null,i=r.length>0?Math.min.apply(Math,r):null;return null!==i&&null!==a&&(i=Math.max.apply(Math,[a,i])),{price:null!==a?(0,t.applyCurrencyConversion)(a):null,compareAtPrice:null!==i?(0,t.applyCurrencyConversion)(i):null}},t.getMin=function(e){return e.length>0?Math.min.apply(Math,e):0},t.getMax=function(e){return e.length>0?Math.max.apply(Math,e):0},t.getPriceDetails=function(e){var n=e.variants.edges,r=(0,t.getProductPriceAndCompareAtPrice)(n),a=(0,t.getVariantCompareAtPrices)(n),i=(0,t.getVariantPrices)(n),o={};return n.forEach((function(e){var n=e.node.id.split("/").pop(),r=parseFloat(e.node.price.amount),a=e.node.compareAtPrice?parseFloat(e.node.compareAtPrice.amount):null;o[n]={price:(0,t.applyCurrencyConversion)(r),compare_at_price:(0,t.applyCurrencyConversion)(a)}})),{price:r.price,compare_at_price:r.compareAtPrice,price_varies:i.filter(t.unique).length>1,compare_at_price_varies:a.filter(t.unique).length>1,price_min:(0,t.applyCurrencyConversion)((0,t.getMin)(i)),price_max:(0,t.applyCurrencyConversion)((0,t.getMax)(i)),compare_at_price_min:(0,t.applyCurrencyConversion)((0,t.getMin)(a)),compare_at_price_max:(0,t.applyCurrencyConversion)((0,t.getMax)(a)),variantPricesMap:o}},t.API_VERSION="2023-04",t.METAFIELD_TYPES={LIST_PRODUCT_REFERENCE:"list.product_reference",COLLECTION_REFERENCE:"collection_reference",SINGLE_LINE_TEXT_FIELD:"single_line_text_field",LIST_SINGLE_LINE_TEXT_FIELD:"list.single_line_text_field"},t.getIdFromGraphqlId=function(e){var t=e.split("/").slice(-1)[0];return parseInt(t)}},192:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.prototype.set=function(e){this.configuration=e.configuration,this.shopifyConfiguration=e.shopifyConfiguration},e.prototype.getConfiguration=function(){return this.configuration},e.prototype.getShopifyConfiguration=function(){return this.shopifyConfiguration},e}();t.default=new n},509:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){var e=this;this.getImages=function(){return"\n      images(first: 250, sortKey: POSITION){\n        edges{\n          node{\n            altText\n            height\n            url\n            width\n            id\n          }\n        }\n      }\n    "},this.getBasicProductDetails=function(){return"\n      id\n      title\n      handle\n      onlineStoreUrl\n      productType\n      vendor\n      tags\n      totalInventory\n      publishedAt\n      availableForSale\n      options{\n        id\n        name\n        values\n      }\n      featuredImage{\n        altText\n        height\n        url\n        width\n        id\n      }\n      priceRange{\n        minVariantPrice{\n          amount\n        }\n        maxVariantPrice{\n          amount\n        }\n      }\n      compareAtPriceRange{\n        minVariantPrice{\n          amount\n        }\n        maxVariantPrice{\n          amount\n        }\n      }\n      featuredImage{\n        altText\n        height\n        url\n        width\n        id\n      }\n    "},this.getMedia=function(){return"\n      media(first: 250){\n        edges{\n          node{\n            alt\n            mediaContentType\n            ... on Video {\n              id\n              mediaContentType\n              previewImage{\n                id\n                altText\n                width\n                height\n                url\n              }\n              alt\n              sources {\n                format\n                height\n                mimeType\n                width\n                url\n              }\n            }\n            ... on MediaImage{\n              id\n              mediaContentType\n              previewImage{\n                id\n                altText\n                width\n                height\n                url\n              }\n              image{\n                id\n                altText\n                width\n                height\n                url\n              }\n            }\n            ... on ExternalVideo{\n              id\n              mediaContentType\n            }\n            ... on Model3d{\n              id\n              mediaContentType\n            }\n          }\n        }\n      }\n    "},this.getVariants=function(){return"\n      variants(first: 250){\n        edges{\n          node{\n            id\n            title\n            quantityAvailable\n            sku\n            selectedOptions{\n              name\n              value\n            }\n            image{\n              id\n            }\n            availableForSale\n            price {\n              amount\n            }\n            compareAtPrice{\n              amount\n            }\n          }\n        }\n      }\n    "},this.getReferenceMetafields=function(t){return t>=1?"":(t+=1,"\n      reference{\n        ... on Product{\n          ".concat(e.getBasicProductDetails(),"\n          ").concat(e.getVariants(),"\n          ").concat(e.getImages(),"\n          ").concat(e.getMedia(),"     \n          ").concat(e.getProductMetafields(t),"\n        }\n        ... on Collection{\n          id\n          title\n          handle\n          products(first: 10){\n            edges{\n              node{\n                ").concat(e.getBasicProductDetails(),"\n                ").concat(e.getVariants(),"\n                ").concat(e.getImages(),"\n                ").concat(e.getMedia(),"     \n                ").concat(e.getProductMetafields(t),"           \n              }\n            }\n          }\n        }\n      }\n      references(first: 10){\n        edges{\n          node{\n            ... on Product{\n              ").concat(e.getBasicProductDetails(),"\n              ").concat(e.getVariants(),"\n              ").concat(e.getImages(),"\n              ").concat(e.getMedia(),"\n              ").concat(e.getProductMetafields(t),"\n            }\n          }\n        }\n      }\n    "))},this.getProductMetafields=function(t){return void 0===t&&(t=0),"\n      metafields(identifiers: $product_metafields){\n        id\n        key\n        namespace\n        type\n        value\n        description\n        ".concat(e.getReferenceMetafields(t),"\n      }\n    ")},this.getProductDetails=function(){return"\n      ".concat(e.getBasicProductDetails(),"\n      ").concat(e.getVariants(),"\n      ").concat(e.getImages(),"\n      ").concat(e.getMedia(),"\n      ").concat(e.getProductMetafields(),"\n    ")}}return e.getFilters=function(){return"\n      filters {\n        id\n        label\n        type\n        values {\n          id\n          label\n          count\n          input\n        }\n      }\n    "},e}();t.default=n},925:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var a=n(527),i="LIST",o="PRICE_RANGE",c="BOOLEAN",s=function(){function e(){}return e.prototype.hasOnlyDefaultVariant=function(e,t){return!(e.length>1||t.length>1||"Title"!==e[0]||"Default Title"!==t[0].option1||null!==t[0].option2||null!==t[0].option3)},e.prototype.formatProducts=function(e){var t=this;return e.edges.map((function(e){return t.formatProduct(e.node)}))},e.prototype.formatProduct=function(t,n){void 0===n&&(n=1);var r=this.formatVariants(t.variants),i=this.formatMedia(t.media),o=this.formatImages(t.images),c=(0,a.getPriceDetails)(t);return{id:(0,a.getIdFromGraphqlId)(t.id),title:t.title,published_at:t.publishedAt,available:t.availableForSale,tags:t.tags,variants:r,featured_image:this.getFeaturedImage(o),images:o,media:i,vendor:t.vendor,product_type:t.productType,metafields:this.formatMetafields(t.metafields,n),handle:t.handle,options_with_values:e.formatOptions(t.options),price:c.price,compare_at_price:c.compare_at_price,price_varies:c.price_varies,compare_at_price_varies:c.compare_at_price_varies,price_min:c.price_min,price_max:c.price_max,compare_at_price_min:c.compare_at_price_min,compare_at_price_max:c.compare_at_price_max,options:t.options.map((function(e){return e.name})),has_only_default_variant:this.hasOnlyDefaultVariant(t.options,r),in_stock:t.totalInventory>0}},e.formatOptions=function(e){return e.map((function(e,t){return{name:e.name,position:t+1,values:e.values}}))},e.prototype.formatImages=function(e){return e.edges.map((function(e,t){var n=e.node;return{position:t+1,alt:n.altText,width:n.width,height:n.height,src:n.url}}))},e.prototype.formatMedia=function(e){var t=this,n=[];return e.edges.forEach((function(e,r){var a=r+1;"IMAGE"===e.node.mediaContentType&&n.push({position:a,media_type:"image",alt:e.node.image.altText,width:e.node.image.width,height:e.node.image.height,src:e.node.image.url,preview_image:t.formatImage(e.node.previewImage)}),"VIDEO"===e.node.mediaContentType&&n.push({position:a,media_type:"video",alt:e.node.alt,duration:e.node.duration,sources:t.formatVideoSources(e.node.sources),preview_image:t.formatImage(e.node.preview.image)})})),n},e.prototype.formatImage=function(e){return{alt:e.altText,width:e.width,height:e.height,src:e.url}},e.prototype.formatVideoSources=function(e){return e.map(this.formatVideoSource)},e.prototype.formatVideoSource=function(e){return{file_size:e.fileSize,format:e.format,mime_type:e.mime_type,height:e.height,width:e.width,url:e.url}},e.prototype.getFeaturedImage=function(e){return e.length>0?e.find((function(e){return 1===e.position})):null},e.prototype.formatVariants=function(e){var t=this;return e.edges.map((function(e,n){return r({id:(0,a.getIdFromGraphqlId)(e.node.id),title:e.node.title,sku:e.node.sku,price:e.node.price?(0,a.applyCurrencyConversion)(e.node.price.amount):null,compare_at_price:e.node.compareAtPrice?(0,a.applyCurrencyConversion)(e.node.compareAtPrice.amount):null,available:e.node.availableForSale,position:n+1,metafields:{}},t.formatSelectedVariantOptions(e.node))}))},e.prototype.formatSelectedVariantOptions=function(e){for(var t={},n=0;n<3;n++)t["option".concat(n+1)]=e.selectedOptions[n]?e.selectedOptions[n].value:null;return t},e.prototype.formatMetafields=function(e,t){var n=this,r={};return e.forEach((function(e){var a;e&&(r[a=e.namespace]||(r[a]={}),r[e.namespace][e.key]=n.formatMetafield(e,t))})),r},e.prototype.formatMetafield=function(e,t){var n=this,r=e.type,i=e.value;if(r===a.METAFIELD_TYPES.COLLECTION_REFERENCE){if(!e.reference)return{type:r,id:(0,a.getIdFromGraphqlId)(e.value)};i={id:(0,a.getIdFromGraphqlId)(e.reference.id),title:e.reference.title,handle:e.reference.handle,products:e.reference.products.edges.map((function(e){return n.formatProduct(e.node,t+1)}))}}if(r===a.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE){if(!e.references)return{type:r,ids:JSON.parse(i).map((function(e){return(0,a.getIdFromGraphqlId)(e)}))};i=e.references.edges.map((function(e){return n.formatProduct(e.node,t+1)}))}return r===a.METAFIELD_TYPES.LIST_SINGLE_LINE_TEXT_FIELD&&(i=JSON.parse(i)),{type:r,value:i}},e.prototype.formatFilters=function(e,t,n){return e.map((function(e){var r=t[e.id],a=e.type===i||e.type===c,s=e.type===o;if(a)return{id:e.id,name:e.label,type:"checkbox",items:e.values.map((function(e){var t=!(!r||!r.includes(e.id));return{id:e.id,name:e.label,count:e.count,selected:t}}))};if(s){var u=JSON.parse(e.values[0].input),l=n.price_ranges,p={id:e.id,name:e.label,type:"range",display_format:"{{currency_label}}{{value}}",min:l?n.price_ranges.min:u.price.min,max:l?n.price_ranges.max:u.price.max};return r&&r.hasOwnProperty("selected_min")&&(p.selected_min=r.selected_min.toString(),p.selected_max=r.selected_max.toString()),p}}))},e.getFilterInputs=function(e){var t={};return e.forEach((function(e){var n=e.type===i||e.type===c,r=e.type===o;n&&e.values.forEach((function(e){t[e.id]={type:"checkbox",input:e.input,label:e.label}})),r&&(t[e.id]={type:"range",input:e.values[0].input,label:e.label})})),t},e.prototype.getImagesToVariantIdsMap=function(e){var t={};return e.edges.forEach((function(e){e.node.image&&(t[e.node.image.id]||(t[e.node.image.id]=[]),t[e.node.image.id].push(e.node.id))})),t},e}();t.default=s},92:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},r.apply(this,arguments)},a=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(a,i){function o(e){try{s(r.next(e))}catch(e){i(e)}}function c(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,c)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=t.call(e,o)}catch(e){i=[6,e],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var o=n(527),c=n(192),s=function(){function e(){}return e.prototype.getProductDetailsForMarket=function(e){return a(this,void 0,void 0,(function(){var t,n,r,a,s,u,l,p,f=this;return i(this,(function(i){switch(i.label){case 0:return e.length?(t=e.map((function(e){return"gid://shopify/Product/".concat(e)})),n="\n      variants(first: 250){\n        edges{\n          node{\n            id\n            price {\n              amount\n            }\n            compareAtPrice{\n              amount\n            }\n          }\n        }\n      }\n    ",r=c.default.shopifyConfiguration.getMetafields(),a="",Object.keys(r).length>0&&(s=r.products.map((function(e){return'{namespace: "'.concat(e.namespace,'", key: "').concat(e.key,'"}')})),a="\n        metafields(identifiers: [".concat(s,"]){\n          id\n          key\n          namespace\n          type\n          value\n          reference{\n            ... on Collection{\n              products(first: 10){\n                edges{\n                  node{\n                    id\n                    ").concat(n,"\n                    metafields(identifiers: [").concat(s,"]){\n                      id\n                      key\n                      namespace\n                      type\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n          references(first: 10){\n            edges{\n              node{\n                ... on Product{\n                  id\n                  ").concat(n,"\n                  metafields(identifiers: [").concat(s,"]){\n                    id\n                    key\n                    namespace\n                    type\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      ")),[4,fetch("https://".concat(c.default.shopifyConfiguration.getMyShopifyDomain(),"/api/").concat(o.API_VERSION,"/graphql.json"),{body:" query allProducts @inContext(country: ".concat(c.default.configuration.getCountryCode(),") {\n        nodes(ids: ").concat(JSON.stringify(t),")\n        {\n          ... on Product{\n            id\n            ").concat(a,"\n            ").concat(n,"\n          }\n        }\n      }\n      "),headers:{"Content-Type":"application/graphql","X-Shopify-Storefront-Access-Token":c.default.shopifyConfiguration.getStorefrontAPIAccessToken()},method:"POST"})]):[2,{}];case 1:return[4,i.sent().json()];case 2:return u=i.sent(),l=u.data.nodes,p={},l.forEach((function(e){if(e){var t=(0,o.getIdFromGraphqlId)(e.id);p[t]=f.getMarketSpecificDetails(e)}})),[2,p]}}))}))},e.prototype.getMarketSpecificDetails=function(e){var t=this,n={};e.hasOwnProperty("metafields")&&e.metafields.forEach((function(e){var r;e&&(n[r=e.namespace]||(n[r]={}),n[e.namespace][e.key]={type:e.type,value:t.getMetafieldValue(e)})}));var a=(0,o.getPriceDetails)(e);return r(r({},a),{productId:(0,o.getIdFromGraphqlId)(e.id),metafields:n})},e.prototype.getMetafieldValue=function(e){var t=this,n=e.type,r=e.value;return n===o.METAFIELD_TYPES.COLLECTION_REFERENCE&&e.reference&&(r={products:e.reference.products.edges.map((function(e){return t.getMarketSpecificDetails(e.node)}))}),n===o.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE&&e.references&&(r=e.references.edges.map((function(e){return t.getMarketSpecificDetails(e.node)}))),r},e.prototype.updateProductDetailsForMarket=function(e){return a(this,void 0,void 0,(function(){var t,n,r=this;return i(this,(function(a){switch(a.label){case 0:return e.hasOwnProperty("products")?(t=e.products.map((function(e){return e.id})),[4,this.getProductDetailsForMarket(t)]):[3,2];case 1:n=a.sent(),e.products.forEach((function(e){n.hasOwnProperty(e.id)?r.mutateProductDetails(e,n[e.id]):r.resetProductPrice(e)})),a.label=2;case 2:return[2,e]}}))}))},e.prototype.mutateProductDetails=function(e,t){e.variants.forEach((function(e){e.price=t.variantPricesMap[e.id].price,e.compare_at_price=t.variantPricesMap[e.id].compare_at_price})),e.price_varies=t.price_varies,e.compare_at_price_varies=t.compare_at_price_varies,e.price=t.price,e.compare_at_price=t.compare_at_price,e.price_min=t.price_min,e.price_max=t.price_max,e.compare_at_price_min=t.compare_at_price_min,e.compare_at_price_max=t.compare_at_price_max,this.updateMetafieldPrices(e.metafields,t.metafields)},e.prototype.updateMetafieldPrices=function(e,t){for(var n in e)for(var r in e[n])if(t.hasOwnProperty(n)&&t[n].hasOwnProperty(r)){var a=t[n][r].value;e[n][r].type===o.METAFIELD_TYPES.COLLECTION_REFERENCE&&this.updateCollectionReferenceMetafield(e[n][r],a),e[n][r].type===o.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE&&this.updateProductListReferenceMetafield(e[n][r],a)}else delete e[n][r],0===Object.keys(e[n]).length&&delete e[n]},e.prototype.idPresentInGivenList=function(e,t){return e.find((function(e){return e===t}))===t},e.prototype.updateCollectionReferenceMetafield=function(e,t){var n=this;if(e.value&&e.value.hasOwnProperty("products")&&Array.isArray(t.products)){var r=t.products.map((function(e){return parseInt(e.productId)}));e.value.products=e.value.products.filter((function(e){return n.idPresentInGivenList(r,parseInt(e.id))})),e.value.products.forEach((function(e){t.hasOwnProperty("products")&&t.products.forEach((function(t){e.id===t.productId&&n.mutateProductDetails(e,t)}))}))}},e.prototype.updateProductListReferenceMetafield=function(e,t){var n=this;if(Array.isArray(t)){var r=t.map((function(e){return parseInt(e.productId)}));e.value=e.value.filter((function(e){return n.idPresentInGivenList(r,parseInt(e.id))})),e.value.forEach((function(e){t.forEach((function(t){e.id===t.productId&&n.mutateProductDetails(e,t)}))}))}},e.prototype.resetProductPrices=function(e){var t=this;return e.products?e.products.forEach((function(e){return t.resetProductPrice(e)})):e},e.prototype.resetProductPrice=function(e){e.price_varies=null,e.compare_at_price_varies=null,e.price=null,e.compare_at_price=null,e.price_min=null,e.price_max=null,e.compare_at_price_min=null,e.compare_at_price_max=null,e.variants.map((function(e){e.price=null,e.compare_at_price=null})),this.resetMetafieldPrices(e.metafields)},e.prototype.resetMetafieldPrices=function(e){var t=this;for(var n in e)for(var r in e[n]){var a=e[n][r];a.type===o.METAFIELD_TYPES.COLLECTION_REFERENCE&&a.value&&a.value.hasOwnProperty("products")&&e[n][r].value.products.map((function(e){t.resetProductPrice(e)})),a.type===o.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE&&a.value&&a.value.map((function(e){"object"==typeof e&&t.resetProductPrice(e)}))}},e.prototype.helpersToExpose=function(){var e=this;return{updateProductDetailsForMarket:function(t){return e.updateProductDetailsForMarket(t)},resetProductPrices:function(t){return e.resetProductPrices(t)}}},e.export=function(){var e=this;return{MultiMarket:{new:function(){return(new e).helpersToExpose()}}}},e}();t.default=s},89:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(a,i){function o(e){try{s(r.next(e))}catch(e){i(e)}}function c(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,c)}s((r=r.apply(e,t||[])).next())}))},a=this&&this.__generator||function(e,t){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=t.call(e,o)}catch(e){i=[6,e],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(527),o=n(192),c=function(){function e(){}return e.prototype.call=function(e,t,n,i){return void 0===i&&(i={}),r(this,void 0,void 0,(function(){var r,i;return a(this,(function(a){switch(a.label){case 0:return[4,fetch(this.url(t),{body:n.params,headers:{"Content-Type":"application/json",Accept:"application/json","X-Shopify-Storefront-Access-Token":o.default.shopifyConfiguration.getStorefrontAPIAccessToken()},method:e})];case 1:return 200!==(r=a.sent()).status?[3,3]:[4,r.json()];case 2:return i=a.sent(),n.hasOwnProperty("onSuccess")?[2,n.onSuccess(i.data)]:[2,i.data];case 3:return void 0!==n.onFailure?[2,n.onFailure(r)]:[2,r]}}))}))},e.prototype.url=function(e){return"https://".concat(o.default.shopifyConfiguration.getMyShopifyDomain(),"/api/").concat(i.API_VERSION,"/").concat(e)},e}();t.default=c},521:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var a=n(527),i=n(192),o=function(e,t,n){return n.indexOf(e)===t},c=function(){function e(){var e=this;this.formatDetail=function(t){var n={};for(var a in t)switch(a){case"__id":n.id=parseInt(t.__id);break;case"name":n.title=t.name;break;case"available":n.available=t.available;break;case"shopify_tags":n.tags=e.formatTags(t.shopify_tags);break;case"variants":n=r(r(r(r({},n),{variants:e.formatVariants(t.variants)}),e.getOptionRelatedFields(t)),e.getPriceRelatedFields(t));break;case"_vendor":n.vendor=e.formatVendor(t._vendor);break;case"images":n.images=e.formatImages(t.images);break;case"metafields":n.metafields=e.formatMetafields(t);break;case"link":n.handle=t.link.split("/products/")[1];break;case"introduced_at":n.published_at=t.introduced_at;break;case"media":var i=e.formatImages(t.images);n.featured_image=e.getFeaturedImage(i),n.media=t.media;case"in_stock":n.in_stock=t.in_stock;break;case"_product_type":n.product_type=e.formatProductType(t._product_type)}return n}}return e.prototype.formatImages=function(e){return e.map((function(e){return{position:e.position,alt:e.alt,width:e.width,height:e.height,src:e.src}}))},e.prototype.getFeaturedImage=function(e){return e.length>0&&e.find((function(e){return 1===e.position}))||null},e.prototype.formatTags=function(e){return Array.isArray(e)?e:e.split(", ").sort()},e.prototype.formatVendor=function(e){return Array.isArray(e)?e[0]:e},e.prototype.formatProductType=function(e){return Array.isArray(e)?e[0]:e},e.prototype.formatMetafields=function(e){var t=this;for(var n in e.metafields)for(var r in e.metafields[n])if(i.default.shopifyConfiguration.isMetafieldConfigured(n,r,"products")){if(e.hasOwnProperty("_references")){if(e._references.metafields.hasOwnProperty(n)&&e._references.metafields[n].hasOwnProperty(r)){var o=e._references.metafields[n][r];e.metafields[n][r].type===a.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE&&(e.metafields[n][r].value=o.value.map((function(e){return t.formatDetail(e)}))),e.metafields[n][r].type===a.METAFIELD_TYPES.COLLECTION_REFERENCE&&(e.metafields[n][r].value={id:parseInt(o.value.id),title:o.value.name,handle:o.value.slug,products:o.value.product_details.map((function(e){return t.formatDetail(e)}))})}}else e.metafields[n][r].type===a.METAFIELD_TYPES.COLLECTION_REFERENCE&&(e.metafields[n][r].id=parseInt(e.metafields[n][r].value[0]),delete e.metafields[n][r].value),e.metafields[n][r].type===a.METAFIELD_TYPES.LIST_PRODUCT_REFERENCE&&(e.metafields[n][r].ids=e.metafields[n][r].value.map((function(e){return parseInt(e)})),delete e.metafields[n][r].value);e.metafields[n][r].type===a.METAFIELD_TYPES.SINGLE_LINE_TEXT_FIELD&&(e.metafields[n][r].value=e.metafields[n][r].value[0])}else delete e.metafields[n][r],0===Object.keys(e.metafields[n]).length&&delete e.metafields[n];return e.metafields},e.prototype.getPriceRelatedFields=function(e){var t=e.variants.filter((function(e){return null!==e.compare_at_price})).map((function(e){return e.compare_at_price})),n=e.variants.filter((function(e){return null!==e.price})).map((function(e){return e.price})),r=e.sale_price,i=t.length>0?Math.min.apply(Math,t):null,c=Math.min.apply(Math,n),s=Math.max.apply(Math,n),u=Math.min.apply(Math,t),l=Math.max.apply(Math,t);return{price_varies:n.filter(o).length>1,compare_at_price_varies:t.filter(o).length>1,price:r?(0,a.applyCurrencyConversion)(r):null,compare_at_price:i?(0,a.applyCurrencyConversion)(i):null,price_min:(0,a.applyCurrencyConversion)(c),price_max:(0,a.applyCurrencyConversion)(s),compare_at_price_min:(0,a.applyCurrencyConversion)(u),compare_at_price_max:(0,a.applyCurrencyConversion)(l)}},e.prototype.getOptionRelatedFields=function(e){var t={};if(e.hasOwnProperty("variants")&&e.hasOwnProperty("options")){var n=e.options.map((function(e){return e.name}));t.options=n,t.options_with_values=e.options.map((function(e){return{name:e.name,position:e.position,values:e.values}})),t.has_only_default_variant=this.hasOnlyDefaultVariant(n,e.variants)}return t},e.prototype.formatVariants=function(e){return e&&e.length?e.map((function(e){return e.price&&(e.price=(0,a.applyCurrencyConversion)(e.price)),e.compare_at_price&&(e.compare_at_price=(0,a.applyCurrencyConversion)(e.compare_at_price)),e})):[]},e.prototype.hasOnlyDefaultVariant=function(e,t){return!(e.length>1||t.length>1||"Title"!==e[0]||"Default Title"!==t[0].option1||null!==t[0].option2||null!==t[0].option3)},e.prototype.helpersToExpose=function(){var e=this;return{formatDetail:function(t){return e.formatDetail(t)}}},e.export=function(){var e=this;return{TagalysToCommonResponseFormatter:{new:function(){return(new e).helpersToExpose()}}}},e}();t.default=c},125:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},r.apply(this,arguments)},a=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(a,i){function o(e){try{s(r.next(e))}catch(e){i(e)}}function c(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,c)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=t.call(e,o)}catch(e){i=[6,e],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var o=n(527),c=n(509),s=n(89),u=n(925),l=n(192),p=[{id:"manual",label:"Featured"},{id:"best-selling",label:"Best selling"},{id:"title-asc",label:"Alphabetically, A-Z"},{id:"title-desc",label:"Alphabetically, Z-A"},{id:"price-asc",label:"Price, low to high"},{id:"price-desc",label:"Price, high to low"},{id:"created-asc",label:"Date, old to new"},{id:"created-desc",label:"Date, new to old"}],f=function(){function e(e,t){this.requestState=e,this.responseState=t,this.queries=new c.default,this.graphqlResponseFormatter=new u.default}return e.prototype.getSortVariables=function(){return{manual:{sortKey:"MANUAL",reverse:!1},"best-selling":{sortKey:"BEST_SELLING",reverse:!1},"created-desc":{sortKey:"CREATED",reverse:!0},"created-asc":{sortKey:"CREATED",reverse:!1},"price-desc":{sortKey:"PRICE",reverse:!0},"price-asc":{sortKey:"PRICE",reverse:!1},"title-asc":{sortKey:"TITLE",reverse:!1},"title-desc":{sortKey:"TITLE",reverse:!0},id:{sortKey:"ID",reverse:!1},"collection-default":{sortKey:"COLLECTION_DEFAULT",reverse:!1}}[this.requestState.sort]},e.prototype.getPaginationVariables=function(){var e={};return this.requestState.endCursor&&(e.after=this.requestState.endCursor,e.first=this.requestState.perPage),this.requestState.startCursor&&(e.before=this.requestState.startCursor,e.last=this.requestState.perPage),this.requestState.startCursor||this.requestState.endCursor||(e.first=this.requestState.perPage),e},e.prototype.getFilterVariables=function(){var e=this,t={};if(Object.keys(this.requestState.filters).length){for(var n=[],r=0,a=Object.entries(this.requestState.filters);r<a.length;r++){var i=a[r],o=(i[0],i[1]),c=o;o.hasOwnProperty("selected_min")?n.push({price:{min:parseFloat(o.selected_min),max:parseFloat(o.selected_max)}}):c.forEach((function(t){if(e.responseState.filter_inputs&&e.responseState.filter_inputs[t]){var r=e.responseState.filter_inputs[t];n.push(JSON.parse(r.input))}}))}t.filters=n}return t},e.prototype.getMetafieldVariables=function(){return l.default.shopifyConfiguration.hasMetafields()?{product_metafields:l.default.shopifyConfiguration.getMetafields().products||[]}:{product_metafields:[]}},e.prototype.getQueryVariables=function(){return r(r(r(r({id:"gid://shopify/Collection/".concat(this.requestState.product_listing_page_id)},this.getSortVariables()),this.getPaginationVariables()),this.getFilterVariables()),this.getMetafieldVariables())},e.prototype.getQuery=function(){return"\n      query Collection(\n        $id: ID,\n        $first: Int,\n        $last: Int,\n        $before: String,\n        $after: String,\n        $sortKey: ProductCollectionSortKeys,\n        $reverse: Boolean,\n        $filters: [ProductFilter!],\n        $product_metafields: [HasMetafieldsIdentifier!]!,\n      ) @inContext(country: ".concat(l.default.configuration.getCountryCode(),") {\n        collection(id: $id){\n          title\n          handle\n          products(first: $first, last: $last, after: $after, before: $before, sortKey: $sortKey, reverse: $reverse, filters: $filters) {\n            filters {\n              id\n              label\n              type\n              values {\n                id\n                label\n                count\n                input\n              }\n            }\n            edges{\n              node{\n                ").concat(this.queries.getProductDetails(),"\n              }\n            }\n            pageInfo{\n              hasNextPage\n              hasPreviousPage\n              endCursor\n              startCursor\n            }\n          }\n        }\n      }\n    ")},e.getFilterInputsQuery=function(){return"\n    query Collection(\n      $id: ID,\n    ) {\n      collection(id: $id){\n        products(first: 1) {\n          ".concat(c.default.getFilters(),"\n        }\n      }\n    }\n    ")},e.prototype.getRequestOptions=function(){return{path:"graphql.json",apiVersion:o.API_VERSION}},e.prototype.getSortOptions=function(e){var t=this,n=e.params.sort_options||p;return n.forEach((function(e){e.id===t.requestState.sort?e.selected=!0:e.selected=!1})),null===this.requestState.sort&&n.length>0&&(n[0].selected=!0),n},e.prototype.formatResponse=function(e,t){return{name:t.collection.title,products:this.graphqlResponseFormatter.formatProducts(t.collection.products),filters:this.graphqlResponseFormatter.formatFilters(t.collection.products.filters,this.requestState.filters,this.responseState.price_ranges),sort_options:this.getSortOptions(e),page_info:t.collection.products.pageInfo,filter_inputs:u.default.getFilterInputs(t.collection.products.filters)}},e.prototype.apiClient=function(){return new s.default},e.prototype.getDataForInitialRequest=function(t){return a(this,void 0,void 0,(function(){var n,r,a,o,c,s,l,p,f,d,h,m;return i(this,(function(i){switch(i.label){case 0:return n=e.getFilterInputsQuery(),[4,this.apiClient().call("POST","graphql.json",{params:JSON.stringify({query:n,variables:{id:"gid://shopify/Collection/".concat(t.params.product_listing_page_id)}})})];case 1:for(r=i.sent(),a=u.default.getFilterInputs(r.collection.products.filters),o=r.collection.products.filters.find((function(e){return"PRICE_RANGE"===e.type})),c={},o&&(c=JSON.parse(o.values[0].input).price),s={},l=function(e,t){var n=r.collection.products.filters.find((function(t){return t.id===e}));if(Array.isArray(t)){var a=[];t.forEach((function(e){"LIST"!==n.type&&"BOOLEAN"!==n.type||n.values.forEach((function(t){e===t.label&&a.push(t.id)}))})),s[e]=a}else s[e]=t},p=0,f=Object.entries(this.requestState.filters);p<f.length;p++)d=f[p],h=d[0],m=d[1],l(h,m);return[2,{filtersForRequestParams:s,filter_inputs:a,price_ranges:c}]}}))}))},e.prototype.helpersToExpose=function(){var e=this;return{getQuery:function(){return e.getQuery()},getQueryVariables:function(){return e.getQueryVariables()},formatResponse:function(t,n){return e.formatResponse(t,n)},getFilterInputs:function(e){return u.default.getFilterInputs(e)},getDataForInitialRequest:function(t){return e.getDataForInitialRequest(t)}}},e.export=function(){var e=this;return{ProductListingPage:{new:function(t,n){return new e(t,n).helpersToExpose()}}}},e}();t.default=f}},t={},n=function n(r){var a=t[r];if(void 0!==a)return a.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(607);TagalysPlatformHelpers=n})();