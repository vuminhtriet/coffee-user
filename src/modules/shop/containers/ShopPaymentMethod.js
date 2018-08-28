import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import ShopPaymentMethod from '../components/ShopPaymentMethod'
import { mapDispatchToProps as shopSettingHandlers } from './ShopSetting'
import { deleteShopPayment } from '../actions'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  ...shopSettingHandlers(dispatch, props),
  deleteShopPaymentMethod: async (token, shopId, paymentId) => {
    try {
      const url = `${BASE_URL}/api/shops/${shopId}/shopPaymentMethods/${paymentId}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PUT',
          headers: {
            Authorization: token
          },
          data: {
            status: 'inactive'
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(deleteShopPayment(paymentId))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  shopPayments: state[MODULE_NAME].shopPayments,
  paymentTypes: state.common.paymentTypes,
  token: state[MODULE_USER].token,
  shopId: state[MODULE_NAME].shop ? state[MODULE_NAME].shop.id : null
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopPaymentMethod)
