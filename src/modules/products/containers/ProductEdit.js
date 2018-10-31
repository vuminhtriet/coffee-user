import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import { uploadProductImage, deleteProductImage } from '../../../common/firebase'
import ProductEdit from '../components/ProductEdit'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_ORDER } from '../../order/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/models'
import { mapDispatchToProps as shopSettingHandlers } from '../../shop/containers/ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  toggleProduct: async (token, product) => {
    try {
      const result = await loading(dispatch, async () => {
        const url = `${TEST_URL}/api/products/${product.id}`
        const response = await axios({
          url,
          method: 'DELETE',
          // headers: {
          //   Authorization: token
          // },
          // data: {
          //   status: product.status === -1 ? 1 : -1
          // }
        })
        // console.log('response', response)
        if (response && response.data) {
          return true
        }
        return false
      })
      return result
    } catch (err) {
      return false
    }
  },
  editProduct: async (token, pureProduct, product, newImages, deleteImages, editImages, user, shop) => {
    try {
      const result = await loading(dispatch, async () => {
        const url = `${TEST_URL}/api/products/${pureProduct.id}`
        const data = {
          productName: product.name,
          productDescription: product.description,
          categoryId: product.privateCategoryId && product.privateCategoryId.id,
          productUpdatedAt: moment().format(),
          productPrice: product.productPrices,
          productStatus: product.quantity > 0 ? true : false,
          productQuantity: product.quantity
          // images: []
        }
        console.log('data', data)
        const response = await axios({
          url,
          method: 'PATCH',
          // headers: {
          //   Authorization: token
          // },
          data
        })
        if (response && response.data) {
          // Delete old images
          // await Promise.all(deleteImages.map(item => {
          //   return deleteProductImage(item.url)
          //     .then(response => {
          //       return axios({
          //         url: `${BASE_URL}/api/images/${item.id}`,
          //         method: 'DELETE',
          //         headers: {
          //           Authorization: token
          //         }
          //       })
          //     }).catch(err => {
          //       console.log('DELETE IMAGE ERROR', err.response)
          //     })
          // }))
          // // Edited
          // await Promise.all(editImages.map(item => {
          //   return axios({
          //     url: `${BASE_URL}/api/images/${item.id}`,
          //     method: 'PUT',
          //     headers: {
          //       Authorization: token
          //     },
          //     data: {
          //       ...item
          //     }
          //   }).catch(err => {
          //     console.log('editImages IMAGE ERROR', err.response)
          //   })
          // }))
          // // // Instal new images
          // console.log('newImages', newImages)
          // await Promise.all(newImages.map(item => {
          //   return uploadProductImage(pureProduct.id, item.fileName, item.resized
          //     ? item.resized.uri : item.fileUri)
          //     .then(response => {
          //       return axios({
          //         url: `${BASE_URL}/api/images`,
          //         method: 'POST',
          //         headers: {
          //           Authorization: token
          //         },
          //         data: {
          //           url: response.ref,
          //           type: item.type,
          //           fullUrl: response.downloadURL,
          //           size: response.totalBytes,
          //           productId: pureProduct.id,
          //           createdAt: moment().format()
          //         }
          //       })
          //     })
          //     .catch(err => {
          //       console.log('UPLOAD IMAGE ERROR', err.response)
          //     })
          // }))
          return true
        }
        return false
      })
      return result
    } catch (err) {
      console.log('err', err)
      return false
    }
  },
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  countries: state.common.countries.sort((next, pre) => {
    return !next.name - pre.name
  }),
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token,
  shop: state[MODULE_SHOP].shop,
  units: state.common.units || [],
  privateCategories: state[MODULE_SHOP].shopCategories
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit)
