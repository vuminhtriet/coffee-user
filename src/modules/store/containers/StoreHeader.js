import axios from 'axios'
import { connect } from 'react-redux'
import { loading, fetch } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { setStoreInformation } from '../actions'
import StoreHeader from '../components/StoreHeader'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  getStoreInformation: async (id) => {
    try {
      const filter = {
        "include":
          ["brand","products",{"reviewShops":["member"]}]
      }

      // const url = `${BASE_URL}/api/shops/${id}?filter=${JSON.stringify(filter)}`
      // const url = `${TEST_URL}/api/shops/${id}?filter%5Binclude%5D%5Bproducts%5D`
      const url = `${TEST_URL}/api/shops/${id}?filter=${JSON.stringify(filter)}`
      // const response = await axios({
      //   url
      // })
      // if (response && response.data) {
      //   return dispatch(setStoreInformation({ ...response.data, privateCategories: {} }))
      // }
      // return false
      return loading(dispatch, async () => {
        const response = await axios({
          url
        })
        // if (response && response.data) {
        //   const response_ = await axios({
        //     url: `${BASE_URL}/api/privateCategories/${id}/images`
        //   })
        //   if (response_ && response_.data) {
        //     return dispatch(setStoreInformation({ ...response.data, privateCategories: response_.data }))
        //   } else {
        //     return false
        //   }
        // }
        if (response && response.data) {
          // return dispatch(setStoreInformation({ ...response.data, privateCategories: {} }))
          return dispatch(setStoreInformation(response.data))
        } else {
          return false
        }
      })
    } catch (e) {
      return false
    }
  },
  updateClick: async (user, shopId) => {
    try {
      console.log("haha", "haha")
      const filter = {
        "where":{
          "memberId": user.id,
          "shopId": shopId
        }
      }
      const url = `${TEST_URL}/api/clickshops?filter=${JSON.stringify(filter)}`

      return loading(dispatch, async () => {
        const response = await axios({ url })
        
        if (response && response.data && response.data.length > 0) {
          const objectId = response.data[0].id
          const url1 = `${TEST_URL}/api/clickshops/${objectId}`
          const tempClicked = response.data[0].clicked + 1
          const response_ = await fetch({
            url: url1,
            method: 'PATCH',
            // headers: {
            //   Authorization: token
            // },
            data: {
              clicked: tempClicked
            }
          }, dispatch)
          console.log("patch",response_.data)
          console.log("get",response.data[0])
          console.log("url1", url1)

          if (response_ && response_.data) {
            return true
          } else {
            return false
          }
        }
        else if(response && response.data && response.data.length<=0) {
          const url2 = `${TEST_URL}/api/clickshops`
          const response_ = await fetch({
            url: url2,
            method: 'POST',
            // headers: {
            //   Authorization: token
            // },
            data: {
              memberId: user.id,
              shopId: shopId,
              clicked: 1
            }
          }, dispatch)
          console.log("post",response_.data)

          if (response_ && response_.data) {
            return true
          } else {
            return false
          }
        }
        else {
          return false
        }
      })
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  detail: state[MODULE_NAME].detail,
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token,
  shippingTypes: state.common.shippingTypes,
  paymentTypes: state.common.paymentTypes
})

export default connect(mapStateToProps, mapDispatchToProps)(StoreHeader)
