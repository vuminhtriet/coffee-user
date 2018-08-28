import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER} from '../../user/models'
import ShopShippingType from '../components/ShopShippingType'
import { mapDispatchToProps as shopSettingHandlers } from './ShopSetting'
import { deleteShopShippingType } from '../actions'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  ...shopSettingHandlers(dispatch, props),
  deleteShopShippingType: async (token, shopId, shippingId) => {
    try {
      const url = `${BASE_URL}/api/shops/${shopId}/shopShippingTypes/${shippingId}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PUT',
          headers: {
            Authorization: token
          },
          data: {
            status: -1
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(deleteShopShippingType(shippingId))
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
  shopShippingTypes: state[MODULE_NAME].shopDeliveryMethods,
  shippingTypes: state.common.shippingTypes,
  token: state[MODULE_USER].token,
  shopId: state[MODULE_NAME].shop ? state[MODULE_NAME].shop.id : null
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopShippingType)
