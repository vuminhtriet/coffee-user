import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import ProcessingCart from '../components/ProcessingCart'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { setShopCarts } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
  getShopCarts: async (token, id) => {
    try {
      const filter = {
        where: {
          'orderStatus': 0,
          'status': {
            'gte': 1
          }
        },
        include: [
          'shop',
          'user',
          { 'shoppingCartAmounts': 'currencyUnit' },
          {
            'relation': 'shoppingCartDetails',
            'scope': {
              'where': {
                'status': 1
              }
            }
          },
          { 'shoppingCartPayments': 'paymentType' }
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
          dispatch(setShopCarts(response.data))
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
  carts: (() => {
    // TODO
    const finalCarts = state[MODULE_SHOP].carts.map(item => {
      const totalItem = item.shoppingCartDetails.reduce((result, elem) => result + elem.quantity, 0)

      const totalAmount = item.shoppingCartAmounts
        .filter(elem => elem.type === 1)
        .map(elem => `${elem.value}${elem.currencyUnit.code}`)
        .join(' + ')

      return { ...item, totalItem, totalAmount }
    })
    return finalCarts
  })(),
  id: state[MODULE_SHOP].shop.id,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingCart)
