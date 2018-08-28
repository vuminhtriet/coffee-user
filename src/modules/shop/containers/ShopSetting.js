import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { uploadShopImage, deleteShopImage } from '../../../common/firebase'
import ShopSetting from '../components/ShopSetting'
import { BASE_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import {
  setShopInformation,
  getShopProducts,
  setShopAddress,
  setShopImage,
  setShopPayment,
  setShopDeliveryMethods,
  setShopCategories,
  loadMoreShopProducts
} from '../actions'
import { MODULE_NAME as SHOP_MODULE } from '../models'
import { MODULE_NAME as USER_MODULE } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  getShopInformation: async (user, token, page = 0) => {
    try {
      const filter = {
        include: [
          {
            'relation': 'products',
            'scope': {
              'include': [
                {
                  'relation': 'productPrices',
                  'scope': {
                    'where': {
                      'status': 1
                    },
                    'include': [
                      'cashUnit',
                      'electricUnit',
                      'promotionPrice'
                    ]
                  }
                },
                'countries',
                {
                  'relation': 'productVariations',
                  'scope': {
                    'where': {
                      'status': 1
                    }
                  }
                },
                'images',
                {
                  'relation': 'productShippingCountries',
                  'scope': {
                    'where': {
                      'status': 1
                    }
                  }
                }
              ],
              'limit': PAGE_SIZE,
              'offset': page * PAGE_SIZE,
              'order': 'totalView DESC'
            }
          },
          'images',
          {
            'relation': 'shopPaymentMethods',
            'scope': {
              'where': {
                'status': 'active'
              },
              'include': 'paymentType'
            }
          },
          'shopShippingTypes',
          'addresses',
          {
            'relation': 'privateCategories',
            'scope': {
              'where': {
                'status': 1
              }
            }
          }
        ]
      }
      const url = `${BASE_URL}/api/shops/${user.shop.id}?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          const shopId = response.data.id
          const response_ = await fetch({
            url: `${BASE_URL}/api/privateCategories/${shopId}/images`,
            headers: {
              Authorization: token
            }
          }, dispatch)
          if (response_ && response_.data) {
            dispatch(setShopInformation({
              ...response.data,
              products: undefined,
              images: undefined,
              shopPaymentMethods: undefined,
              privateCategories: undefined,
              shopShippingTypes: undefined
            }))
            dispatch(getShopProducts(response.data.products))
            dispatch(setShopImage(response.data.images))
            dispatch(setShopAddress(response.data.addresses.find(item => item.isDefault)))
            dispatch(setShopPayment(response.data.shopPaymentMethods))
            dispatch(setShopDeliveryMethods(response.data.shopShippingTypes))
            dispatch(setShopCategories(response_.data))
            return true
          } else {
            return false
          }
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  getShopProducts: async (shop, page = 0, sort = 'totalView DESC') => {
    try {
      const filter = {
        include: [
          {
            'relation': 'productPrices',
            'scope': {
              'where': {
                'status': 1
              },
              'include': [
                'cashUnit',
                'electricUnit',
                'promotionPrice'
              ]
            }
          },
          'countries',
          {
            'relation': 'productVariations',
            'scope': {
              'where': {
                'status': 1
              }
            }
          },
          'images',
          {
            'relation': 'productShippingCountries',
            'scope': {
              'where': {
                'status': 1
              }
            }
          }
        ],
        'limit': PAGE_SIZE,
        'offset': page * PAGE_SIZE,
        'order': sort
      }
      const url = `${BASE_URL}/api/shops/${shop.id}/products?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        if (response.data.length === 0) {
          return false
        }
        if (page === 0) {
          dispatch(getShopProducts([...response.data]))
        } else {
          dispatch(loadMoreShopProducts([...response.data]))
        }
        return true
      }
      return false
    } catch (error) {
      return false
    }
  },
  getShopImages: async (shop) => {
    try {
      const filter = {
        where: {
          shopId: shop.id
        }
      }
      const images = await axios({
        url: `${BASE_URL}/api/images`,
        params: {
          filter: JSON.stringify(filter)
        }
      })
      if (images.data) {
        dispatch(setShopImage(images.data))
        return images.data
      }
      return false
    } catch (error) {
      return false
    }
  },
  uploadImages: async (token, shop, newImages, deleteImages, editImages) => {
    try {
      const result = await loading(dispatch, async () => {
        await Promise.all(deleteImages.map(item => {
          return deleteShopImage(item.url)
            .catch(() => null)
            .then(response => {
              return fetch({
                url: `${BASE_URL}/api/images/${item.id}`,
                method: 'DELETE',
                headers: {
                  Authorization: token
                }
              }, dispatch)
            }).catch(err => {
              console.log('DELETE IMAGE ERROR', err.response)
            })
        }))
        // Edited
        await Promise.all(editImages.map(item => {
          return fetch({
            url: `${BASE_URL}/api/images/${item.id}`,
            method: 'PUT',
            headers: {
              Authorization: token
            },
            data: {
              ...item
            }
          }, dispatch).catch(err => {
            console.log('editImages IMAGE ERROR', err.response)
          })
        }))
        // Instal new images
        await Promise.all(newImages.map(item => {
          return uploadShopImage(shop.id, item.fileName, item.resized
            ? item.resized.uri : item.fileUri)
            .then(response => {
              return fetch({
                url: `${BASE_URL}/api/images`,
                method: 'POST',
                headers: {
                  Authorization: token
                },
                data: {
                  type: item.type,
                  url: response.ref,
                  fullUrl: response.downloadURL,
                  size: response.totalBytes,
                  shopId: shop.id,
                  createdAt: moment().format()
                }
              }, dispatch)
            })
            .catch(err => {
              console.log('UPLOAD IMAGE ERROR', err.response)
            })
        }))
        return true
      })
      return result
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  token: state[USER_MODULE].token,
  user: state[USER_MODULE].user,
  shop: state[SHOP_MODULE].shop,
  shopImages: state[SHOP_MODULE].shopImages,
  cover: state[SHOP_MODULE].shopImages && state[SHOP_MODULE].shopImages
    .find(item => item.type === 2)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopSetting)
