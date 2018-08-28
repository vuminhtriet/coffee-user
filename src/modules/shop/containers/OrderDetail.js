import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setOrderDetail, updateOrder, deleteProof } from '../actions'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import OrderDetail from '../components/OrderDetail'
import { ORDER_STATUS } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrderDetail: (id, token) => {
    try {
      const filter = {
        include: [
          { 'user': 'images' },
          'address',
          { 'shop': 'images' },
          { 'shopShippingType': 'shippingType' },
          { 'cartAdditionalFees': 'currencyUnit' },
          {
            'shoppingCartDetails': [
              { 'product': 'images' },
              'productVariation',
              'cashUnit',
              'electricUnit'
            ]
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
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(setOrderDetail(response.data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteOrder: (id, token, data) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/delete-order`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data
        }, dispatch)
        if (response && response.data) {
          dispatch(updateOrder({ ...data }))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  updateOrder: (id, data, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/update-order`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          data: data,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(updateOrder(data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  completeOrder: (id, data, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/complete-order`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          data: data,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(updateOrder(data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteProof: (id, shoppingCartPaymentId) => {
    return dispatch(deleteProof({ id, shoppingCartPaymentId }))
  }
})

const mapStateToProps = state => ({
  token: state[MODULE_USER].token,
  order: (() => {
    const order = state[MODULE_SHOP].order

    const totalItem = order && order.shoppingCartDetails
      ? order.shoppingCartDetails.reduce((result, item) => result + item.quantity, 0)
      : 0

    const subTotalAmount = order && order.shoppingCartAmounts
      ? order.shoppingCartAmounts
        .filter(item => item.type === 0)
        .map(item => `${item.value}${item.currencyUnit.code}`)
        .join(' + ')
      : 0

    const totalAmount = order && order.shoppingCartAmounts
      ? order.shoppingCartAmounts
        .filter(item => item.type === 1)
        .map(item => `${item.value}${item.currencyUnit.code}`)
        .join(' + ')
      : 0

    const shoppingCartDetails = order && order.shoppingCartDetails
      ? order.shoppingCartDetails.map(item => {
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

    return order ? { ...order, totalItem, totalAmount, subTotalAmount, shoppingCartDetails } : order
  })()
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
