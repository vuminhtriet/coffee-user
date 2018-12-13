import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { uploadShopImage, deleteShopImage } from '../../../common/firebase'
import ShopSetting from '../components/ShopSetting'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import {
  setShopInformation,
  getShopProducts,
  setShopAddress,
  setShopImage,
  setShopPayment,
  setShopDeliveryMethods,
  setShopCategories,
  loadMoreShopProducts,
  getUserPoints,
  loadMoreUserPoints,
  getDetailPointLists,
  loadMoreDetailPointLists
} from '../actions'
import { MODULE_NAME as SHOP_MODULE } from '../models'
import { MODULE_NAME as USER_MODULE } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  getShopInformation: async (user, token, page = 0) => {
    try {
      const filter = {
        "include":{
          "relation":"categories",
          "scope":{
            "include":{
              "relation":"products",
              "scope":{
                "fields":"productName"
              }
            }
          }
        }
      }
      const url = `${TEST_URL}/api/shops/${user.shopId}?filter%5Binclude%5D%5Bproducts%5D`
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
            url : `${TEST_URL}/api/shops/${shopId}?filter=${JSON.stringify(filter)}`
            // headers: {
            //   Authorization: token
            // }
          }, dispatch)
          if (response_ && response_.data) {
            const images = {
              "shopFeaturedImages": response.data.shopFeaturedImages 
              && response.data.shopFeaturedImages,
              "shopLogo": response.data.shopLogo && response.data.shopLogo
            }
            dispatch(setShopInformation({
              ...response.data,
              products: undefined,
              images: undefined,
              shopPaymentMethods: undefined,
              privateCategories: undefined,
              shopShippingTypes: undefined
            }))
            dispatch(getShopProducts(response.data.products))
            dispatch(setShopImage(images))
            dispatch(setShopAddress(response.data.address))
            dispatch(setShopPayment(response.data.shopPaymentMethods))
            dispatch(setShopDeliveryMethods(response.data.shopShippingTypes))
            dispatch(setShopCategories(response_.data.categories))
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
  getShopProducts: async (shop, page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "order":sort
      }

      {options.cityId && !options.max &&
        (filter = {
          "where":{
           "address.cityId":options.cityId,
           "address.districtId":options.districtId
          },
          "order": sort
        })
      }

       {!options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
           "productPrice":{"lte":options.max}
          },
          "order": sort
        })
      }

      {!options.cityId && options.max > 0 && options.min &&
        (filter = {
          "where":{
           "and":[{"productPrice":{"gte":options.min}},{"productPrice":{"lte":options.max}}]
          },
          "order": sort
        })
      }

      {options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
              "address.cityId":options.cityId,
              "address.districtId":options.districtId,
              "productPrice":{"lte":options.max}
          },
          "order": sort
        })
      }

      {options.cityId && options.max > 0 && options.min &&
        (filter = {
          "where":{
              "address.cityId":options.cityId,
              "address.districtId":options.districtId,
              "and":[{"productPrice":{"gte":options.min}},{"productPrice":{"lte":options.max}}]
          },
          "order": sort
        })
      }

      const url = `${TEST_URL}/api/shops/${shop.id}/products?filter=${JSON.stringify(filter)}`
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
  getUserPoints: async (shop, page = 0, sort = 'avgRating DESC') => {
    try {
      var filter = {
        "where": {
          "shopId": shop.id
        },
        "include":{
          "relation":"member"
         },
        "order":sort
      }

      const url = `${TEST_URL}/api/points?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        if (response.data.length === 0) {
          return false
        }
        if (page === 0) {
          dispatch(getUserPoints([...response.data]))
        } else {
          dispatch(loadMoreUserPoints([...response.data]))
        }
        return true
      }
      return false
    } catch (error) {
      return false
    }
  },

  getDetailPointLists: async (shop, page = 0, sort = 'avgRating DESC', memberId) => {
    try {
      var filter = {
        "where": {
          "memberId": memberId,
          "shopId": shop.id
        },
        "order":sort
      }

      const url = `${TEST_URL}/api/shops/${shop.id}/products?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        if (response.data.length === 0) {
          return false
        }
        if (page === 0) {
          dispatch(getDetailPointLists([...response.data]))
        } else {
          dispatch(loadMoreDetailPointLists([...response.data]))
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
      const response = await axios({
        url: `${TEST_URL}/api/shops/${shop.id}`
      })
      if (response.data) {
        const images = {
          "shopFeaturedImages": response.data.shopFeaturedImages 
          && response.data.shopFeaturedImages,
          "shopLogo": response.data.shopLogo && response.data.shopLogo
        }
        dispatch(setShopImage(images))
        return images
      }
      return false
    } catch (error) {
      return false
    }
  },
  uploadImages: async (token, shop, newImages, deleteImages, cover) => {
    try {
      const date = moment().format()
      let mainImages = shop.shopFeaturedImages || []
      const result = await loading(dispatch, async () => {
        //edit image at index 0 if image is string
        if(typeof(cover) === "string"){
          let index = mainImages.indexOf(cover)
          let element = mainImages.splice(index,1)
          mainImages.unshift(element[0])
        }
        
        //Delete cover images
        if (deleteImages.shopFeaturedImages.length > 0){
          await Promise.all(deleteImages.shopFeaturedImages.map(item => {
            let response =  fetch({
              url: item.replace("download", "files"),
              method: 'DELETE'
            })
            if (response){
              let index = mainImages.indexOf(item)
              mainImages.splice(index, 1)
            }
            })
          )
        }

        // Instal new cover images
        if (newImages.shopFeaturedImages.length > 0){
          await Promise.all(
            newImages.shopFeaturedImages.map(item => {
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
        
        //final patch cover image
        if (mainImages){
          let response = await fetch({
          url: `${TEST_URL}/api/shops/${shop.id}`,
          method: 'PATCH',
          data: {
            shopFeaturedImages: mainImages
          }
          })
          if(response && response.data){
            console.log(response.data)
          }
          else{
            console.log('patch complete cover image error')
          }
        }

        //delete logo image
        if (deleteImages.shopLogo) {
          let response = await fetch({
            url: deleteImages.shopLogo.replace("download", "files"),
            method: 'DELETE'
          })
          if (response && response.data) {
            console.log(response.data)
          }
          else{
            console.log('delete logo error')
          }
        }

        //add logo image
        if (newImages.shopLogo) {
          let image = new FormData()
          image.append(date + newImages.shopLogo.fileName, {
            uri: newImages.shopLogo.fileUri,
            type: "image/jpeg",
            name: date + newImages.shopLogo.fileName
          })
          let response = await fetch({
            url: `${TEST_URL}/api/containers/drink2pics/upload`,
            method: 'POST',
            data: image
          })
          if(response && response.data){
            let response_ = await fetch({
              url: `${TEST_URL}/api/shops/${shop.id}`,
              method: 'PATCH',
              data: {
                shopLogo: `${TEST_URL}/api/containers/drink2pics/download/${date + newImages.shopLogo.fileName}`
              }
            })
            if(response_ && response_.data){
              console.log(response_.data)
            }
            else{
              console.log('patch logo error')
            }
          }
          else{
            console.log('post logo error')
          }
        }

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
  cover: state[SHOP_MODULE].shopImages && state[SHOP_MODULE].shopImages.shopFeaturedImages
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopSetting)
