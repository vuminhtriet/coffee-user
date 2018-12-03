import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import { uploadProductImage, deleteProductImage } from '../../../common/firebase'
import ProductEdit from '../components/ProductEdit'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { loading, fetch } from '../../../common/effects'
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
  editProduct: async (token, pureProduct, product, newImages, deleteImages, cover, user, shop) => {
    try {
      const result = await loading(dispatch, async () => {
        const date = moment().format()
        let mainImages = pureProduct.productCoverImage || []
        //edit image at index 0 if image is string
        if(typeof(cover) === "string"){
          let index = mainImages.indexOf(cover)
          let element = mainImages.splice(index,1)
          mainImages.unshift(element[0])
        }

        console.log("delete", deleteImages)
        console.log("new", newImages)
        console.log("main", mainImages)
        
        //Delete cover images
        if (deleteImages.length > 0){
          await Promise.all(deleteImages.map(item => {
            let response = fetch({
              url: item.replace("download", "files"),
              method: 'DELETE'
            })
            console.log(response)
            if (response){
              let index = mainImages.indexOf(item)
              mainImages.splice(index, 1)
            }
            })
          )
        }

        // Instal new cover images
        if (newImages.length > 0){
          await Promise.all(
            newImages.map(item => {
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
              if(item === cover){
                mainImages.unshift(
                  `${TEST_URL}/api/containers/drink2pics/download/${date + item.fileName}`)
                  console.log(mainImages)
              }
              else {
                mainImages.push(
                  `${TEST_URL}/api/containers/drink2pics/download/${date + item.fileName}`)
                  console.log(mainImages)
              }
            }
            })
          )
        }

        //final patch
        const url = `${TEST_URL}/api/products/${pureProduct.id}`
        let data = {
          productName: product.name,
          productDescription: product.description,
          categoryId: product.privateCategoryId && product.privateCategoryId.id,
          productUpdatedAt: moment().format(),
          productPrice: product.productPrices,
          // productStatus: product.quantity > 0 ? true : false,
          // productQuantity: product.quantity
        }
        if (mainImages) {
          data = {
            productName: product.name,
            productDescription: product.description,
            categoryId: product.privateCategoryId && product.privateCategoryId.id,
            productUpdatedAt: moment().format(),
            productPrice: product.productPrices,
            // productStatus: product.quantity > 0 ? true : false,
            // productQuantity: product.quantity
            productCoverImage: mainImages
          }
        }
        console.log('data', data)
        const response_ = await axios({
          url,
          method: 'PATCH',
          // headers: {
          //   Authorization: token
          // },
          data
        })
        if(response_ && response_.data){
          console.log(response_)
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
