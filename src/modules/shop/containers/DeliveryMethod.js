import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { addDeliveryMethod } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import DeliveryMethod from '../components/DeliveryMethod'

const mapDispatchToProps = (dispatch, props) => ({
  addShopDeliveryMethod: async (token, shop, values) => {
    try {
      const url = `${BASE_URL}/api/shops/${shop.id}/shopShippingTypes`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data: {
            description: values.description,
            shopId: shop.id,
            shippingTypeId: values.shippingTypeId,
            status: 1
          }
        }, dispatch)
        if (response && response.data) {
          return dispatch(addDeliveryMethod({
            ...response.data
          }))
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  token: state[MODULE_USER].token,
  shop: state[MODULE_SHOP].shop,
  shippingTypes: state.common.shippingTypes,
  shopShippingTypes: state[MODULE_SHOP].shopDeliveryMethods
})

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryMethod)
