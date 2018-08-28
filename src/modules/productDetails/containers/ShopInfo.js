import axios from 'axios'
import { connect } from 'react-redux'
import ShopInfo from '../components/ShopInfo'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getShopInfo } from '../actions'

const filter = {'include': ['shopPaymentMethods', 'addresses', 'shopShippingTypes']}

const mapDispatchToProps = (dispatch, props) => ({
  getShopInfo: async ({ shopId = 1 }) => {
    try {
      const url = `${BASE_URL}/api/shops/${shopId}`
      const response = await axios({ url })
      if (response && response.data) {
        return dispatch(getShopInfo({...response.data}))
      } else {
        //
      }
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopInfo)
