import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setCartDetail, checkoutCart, deleteCart } from '../actions'
import { MODULE_NAME as MODULE_CART } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import UserCartDetail from '../components/UserCartDetail'

const mapDispatchToProps = (dispatch, props) => ({
  getCartDetail: async (id, token) => {
    try {
      const filter = {
        include: [
          'user',
          { 'address': 'country' },
          {
            'shop': [
              'images',
              {
                'relation': 'shopShippingTypes',
                'scope': {
                  'where': {
                    'status': 1
                  },
                  'include': 'shippingType'
                }
              }
            ]
          },
          { 'shopShippingType': 'shippingType' },
          { 'cartAdditionalFees': 'currencyUnit' },
          {
            'relation': 'shoppingCartDetails',
            'scope': {
              'where': {
                'status': 1
              },
              'include': [
                { 'product': 'images' },
                'productVariation',
                'cashUnit',
                'electricUnit'
              ]
            }
          },
          { 'shoppingCartAmounts': 'currencyUnit' },
          {
            'shoppingCartPayments': [
              'paymentType',
              'userPaymentMethod',
              'currencyUnit',
              'proofs'
            ]
          }
        ]
      }
      const url = `${BASE_URL}/api/shoppingCarts/${id}?filter=${JSON.stringify(filter)}`
      await dispatch(setCartDetail(null))
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          console.log(response.data)
          dispatch(setCartDetail(response.data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  checkoutCart: (id, data, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/checkout-cart`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          data,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(checkoutCart(data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteCart: (id, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/delete-cart`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(setCartDetail(null))
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
  cart: (() => {
    const cart = state[MODULE_CART].cart

    const totalItem = cart && cart.shoppingCartDetails
      ? cart.shoppingCartDetails.reduce((result, item) => result + item.quantity, 0)
      : 0

    const subTotalAmount = cart && cart.shoppingCartAmounts
      ? cart.shoppingCartAmounts
        .filter(item => item.type === 0)
        .map(item => `${item.value}${item.currencyUnit.code}`)
        .join(' + ')
      : 0

    const totalAmount = cart && cart.shoppingCartAmounts
      ? cart.shoppingCartAmounts
        .filter(item => item.type === 1)
        .map(item => `${item.value}${item.currencyUnit.code}`)
        .join(' + ')
      : 0

    const shoppingCartDetails = cart && cart.shoppingCartDetails
      ? cart.shoppingCartDetails.map(item => {
        const cashAmount = item.cashUnitId
          ? `${item.cashValue}${item.cashUnit.code}`
          : ``
        const electricAmount = item.electricUnitId
          ? `${item.electricValue}${item.electricUnit.code}`
          : ``
        const unitAmount = cashAmount && electricAmount
          ? `${cashAmount} + ${electricAmount}`
          : cashAmount
            ? `${cashAmount}`
            : `${electricAmount}`
        return { ...item, unitAmount }
      })
      : []

    return cart ? { ...cart, totalItem, totalAmount, subTotalAmount, shoppingCartDetails } : cart
  })(),
  units: state.common.units
})

export default connect(mapStateToProps, mapDispatchToProps)(UserCartDetail)
