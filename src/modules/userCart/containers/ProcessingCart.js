import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import ProcessingCart from '../components/ProcessingCart'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../../productDetails/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { setUserCarts } from '../../cart/actions'

const mapDispatchToProps = (dispatch, props) => ({
  getCheckedOutCarts: (id, token) => {
    try {
      const filter = {
        where: {
          'orderStatus': 0
        },
        include: [
          'shop',
          'user',
          { 'shoppingCartAmounts': 'currencyUnit' },
          'shoppingCartDetails'
        ],
        order: 'updatedAt DESC'
      }
      const url = `${BASE_URL}/api/users/${id}/shoppingCarts?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await axios({
          url,
          headers: {
            Authorization: token
          }
        })
        if (response && response.data) {
          dispatch(setUserCarts(response.data))
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
  carts: state[MODULE_PRODUCT_DETAIL].carts,
  currencyUnits: state.common.units,
  userId: state[MODULE_USER].user ? state[MODULE_USER].user.id : null,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingCart)
