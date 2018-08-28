import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import Product from '../components/Product'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { uploadProductImage } from '../../../common/firebase'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { mapDispatchToProps as shopSettingHandlers } from '../../shop/containers/ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  addProduct: async (token, product, images, shop) => {
    try {
      // const result = await loading(dispatch, async () => {
      //   const url = `${BASE_URL}/api/products`
      //   const response = await axios({
      //     url,
      //     method: 'POST',
      //     headers: {
      //       Authorization: token
      //     },
      //     data: {
      //       name: product.name,
      //       description: product.description,
      //       weight: product.weight,
      //       isNew: product.isNew === 1,
      //       publicCategoryId: product.publicCategoryId && product.publicCategoryId.id,
      //       privateCategoryId: product.privateCategoryId && product.privateCategoryId.id,
      //       userId: user.id,
      //       shopId: shop.id,
      //       countries: product.countries
      //     }
      //   })
      //   if (response && response.data) {
      //     const { id: productId } = response.data
      //     await Promise.all(images.map(item => {
      //       return uploadProductImage(productId, item.fileName, item.resized
      //         ? item.resized.uri : item.fileUri)
      //         .then(response => {
      //           return axios({
      //             url: `${BASE_URL}/api/images`,
      //             method: 'POST',
      //             headers: {
      //               Authorization: token
      //             },
      //             data: {
      //               url: response.ref,
      //               fullUrl: response.downloadURL,
      //               size: response.totalBytes,
      //               productId,
      //               type: item.type,
      //               createdAt: moment().format()
      //             }
      //           })
      //         })
      //         .catch(err => {
      //           console.log('UPLOAD IMAGE ERROR', err.response)
      //         })
      //     }))
      //     await Promise.all(product.productCountries.map(item => {
      //       return axios({
      //         url: `${BASE_URL}/api/products/${productId}/countries`,
      //         method: 'POST',
      //         headers: {
      //           Authorization: token
      //         },
      //         data: {
      //           ...item
      //         }
      //       }).catch(error => console.log(error.response))
      //     }))
      //     await Promise.all(product.productVariants.map(item => {
      //       return axios({
      //         url: `${BASE_URL}/api/products/${productId}/productVariations`,
      //         method: 'POST',
      //         headers: {
      //           Authorization: token
      //         },
      //         data: {
      //           ...item,
      //           productId: productId
      //         }
      //       }).catch(error => console.log(error.response))
      //     }))
      //     await Promise.all(product.productPrices.map(item => {
      //       return axios({
      //         url: `${BASE_URL}/api/products/${productId}/productPrices`,
      //         method: 'POST',
      //         headers: {
      //           Authorization: token
      //         },
      //         data: {
      //           isInFlashSales: item.flashSale,
      //           cashValue: !item.flashSale
      //             ? item.origin && item.origin.cash ? item.origin.cash.value : null
      //             : item.sale && item.sale.cash ? item.sale.cash.value : null,
      //           electricValue: !item.flashSale
      //             ? item.origin && item.origin.crypto ? item.origin.crypto.value : null
      //             : item.sale && item.sale.crypto ? item.sale.crypto.value : null,
      //           cashUnitId: !item.flashSale
      //             ? item.origin && item.origin.cash ? item.origin.cash.unit.id : null
      //             : item.sale && item.sale.cash ? item.sale.cash.unit.id : null,
      //           electricUnitId: !item.flashSale
      //             ? item.origin && item.origin.crypto ? item.origin.crypto.unit.id : null
      //             : item.sale && item.sale.crypto ? item.sale.crypto.unit.id : null,
      //           status: 1
      //         }
      //       }).catch(error => console.log(error.response))
      //     }))
      //     return true
      //   }
      //   return false
      // })
      // return result
      const url = `${BASE_URL}/api/products/add-product`
      const metaData = {
        name: product.name,
        description: product.description,
        weight: product.weight,
        createdAt: moment().format(),
        updatedAt: moment().format(),
        status: 1,
        type: 0,
        monthlyView: 0,
        totalView: 0,
        totalRatingValue: 0,
        totalUserRating: 0,
        totalUserFavorite: 0,
        averageRatingValue: 0,
        isNew: product.isNew === 1,
        shopId: shop.id,
        publicCategoryId: product.publicCategoryId && product.publicCategoryId.id,
        privateCategoryId: product.privateCategoryId && product.privateCategoryId.id
      }
      const variations = product.productVariants.map(item => {
        return { ...item, status: 1 }
      })
      const prices = product.productPrices.map(item => {
        return {
          isInFlashSales: item.flashSale,
          cashValue: !item.flashSale
            ? item.origin && item.origin.cash
              ? item.origin.cash.value
              : null
            : item.sale && item.sale.cash
              ? item.sale.cash.value
              : null,
          electricValue: !item.flashSale
            ? item.origin && item.origin.crypto
              ? item.origin.crypto.value
              : null
            : item.sale && item.sale.crypto
              ? item.sale.crypto.value
              : null,
          cashUnitId: !item.flashSale
            ? item.origin && item.origin.cash
              ? item.origin.cash.unit.id
              : null
            : item.sale && item.sale.cash
              ? item.sale.cash.unit.id
              : null,
          electricUnitId: !item.flashSale
            ? item.origin && item.origin.crypto
              ? item.origin.crypto.unit.id
              : null
            : item.sale && item.sale.crypto
              ? item.sale.crypto.unit.id
              : null,
          status: 1
        }
      })
      const tags = []
      const shippingToCountries = product.productCountries.map(item => {
        return { countryId: item }
      })

      return loading(dispatch, async () => {
        const response = await axios({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data: {
            metaData,
            variations,
            prices,
            tags,
            shippingToCountries
          }
        })

        if (response && response.data) {
          const newProduct = response.data
          await Promise.all(images.map(item => {
            return uploadProductImage(newProduct.metaData.id, item.fileName, item.resized
              ? item.resized.uri : item.fileUri)
              .then(response => {
                return axios({
                  url: `${BASE_URL}/api/images`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    url: response.ref,
                    fullUrl: response.downloadURL,
                    size: response.totalBytes,
                    productId: newProduct.metaData.id,
                    type: item.type,
                    createdAt: moment().format()
                  }
                })
              })
              .catch(() => {
                return false
              })
          }))

          return true
        }
        return false
      })
    } catch (e) {
      return false
    }
  },
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  countries: state.common.countries.sort((next, pre) => {
    return !next.name - pre.name
  }),
  token: state[MODULE_USER].token,
  shop: state[MODULE_SHOP].shop,
  shopDeliveryMethods: state[MODULE_SHOP].shopDeliveryMethods
})

export default connect(mapStateToProps, mapDispatchToProps)(Product)
