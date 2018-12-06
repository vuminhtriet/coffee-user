import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import Product from '../components/Product'
import { loading, fetch } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { uploadProductImage } from '../../../common/firebase'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { mapDispatchToProps as shopSettingHandlers } from '../../shop/containers/ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  addProduct: async (token, product, images, shop) => {
    try {
      const url = `${TEST_URL}/api/products`
      const date = moment().format()
      const result = await loading(dispatch, async () => {
        let mainImages = []
        if (images.length > 0){
          await Promise.all(
            images.map(item => {
            let image = new FormData()
            image.append(date + item.fileName, {
              uri: item.fileUri,
              type: "image/jpeg",
              name: date + item.fileName
            })
            let response = fetch({
              url: `${TEST_URL}/api/containers/drink2pics/upload`,
              method: 'POST',
              data: image
            })
            console.log(response)
            if (response){
              mainImages.push(
                `${TEST_URL}/api/containers/drink2pics/download/${date + item.fileName}`)
              console.log(mainImages)
            }
            })
          )
        }

        let response = await axios({
          url,
          method: 'POST',
          // headers: {
          //   Authorization: token
          // },
          data: {
            productName: product.name,
            productDescription: product.description,
            productCreatedAt: moment().format(),
            productUpdatedAt: moment().format(),
            productStatus: true,
            avgRating: 0,
            productTotalFavorite: 0,
            productPrice: product.productPrices,
            // productQuantity: product.quantity,
            shopId: shop.id,
            categoryId: product.publicCategoryId && product.publicCategoryId.id,
            productCoverImage: mainImages,
            address: shop.address,
            productIsPopular: false
          }
        })

        if (response && response.data) {
          // const newProduct = response.data
          // await Promise.all(images.map(item => {
          //   return uploadProductImage(newProduct.metaData.id, item.fileName, item.resized
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
          //           fullUrl: response.downloadURL,
          //           size: response.totalBytes,
          //           productId: newProduct.metaData.id,
          //           type: item.type,
          //           createdAt: moment().format()
          //         }
          //       })
          //     })
          //     .catch(() => {
          //       return false
          //     })
          // }))

          return true
        }
        return false
      })
      return result
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
