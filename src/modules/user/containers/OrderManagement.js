import axios from 'axios'
import { connect } from 'react-redux'
import OrderManagement from '../../shop/components/OrderManagement'
import { MODULE_NAME } from '../models'
import { setUserOrders } from '../actions'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrders: async (id, token) => {
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
          'shoppingCartDetails',
          { 'shoppingCartAmounts': 'currencyUnit' }
        ],
        order: 'updatedAt DESC'
      }
      const url = `${BASE_URL}/api/users/${id}/shoppingCarts?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(setUserOrders(response.data))
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
  orders: (() => {
    // TODO
    const finalOrders = state[MODULE_NAME].userOrders.map(item => {
      const totalItem = item.shoppingCartDetails.reduce((result, elem) => result + elem.quantity, 0)

      const totalAmount = item.shoppingCartAmounts
        .filter(elem => elem.type === 1)
        .map(elem => `${elem.value}${elem.currencyUnit.code}`)
        .join(' + ')

      return { ...item, totalItem, totalAmount }
    })
    return finalOrders
  })(),
  token: state[MODULE_NAME].token,
  user: state[MODULE_NAME].user,
  id: state[MODULE_NAME].user.id
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagement)
