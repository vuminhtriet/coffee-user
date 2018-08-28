import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setShopOrders } from '../actions'
import OrderManagement from '../components/OrderManagement'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrders: (id, token) => {
    try {
      const filter = {
        where: {
          'orderStatus': {
            'neq': 0
          }
        },
        include: [
          'shop',
          'user',
          { 'shoppingCartAmounts': 'currencyUnit' },
          'shoppingCartDetails'
        ],
        order: 'updatedAt DESC'
      }
      const url = `${BASE_URL}/api/shops/${id}/shoppingCarts?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(setShopOrders(response.data))
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
  token: state[MODULE_USER].token,
  orders: (() => {
    // TODO
    const finalOrders = state[MODULE_SHOP].orders.map(item => {
      const totalItem = item.shoppingCartDetails.reduce((result, elem) => result + elem.quantity, 0)

      const totalAmount = item.shoppingCartAmounts
        .filter(elem => elem.type === 1)
        .map(elem => `${elem.value}${elem.currencyUnit.code}`)
        .join(' + ')

      return { ...item, totalItem, totalAmount }
    })
    return finalOrders
  })(),
  id: state[MODULE_SHOP].shop.id
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagement)
