import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
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
          ["products",{"reviewShops":["member"]}]
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
