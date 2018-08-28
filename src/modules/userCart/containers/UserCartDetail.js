import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setCartDetail, checkoutCart, getUserPaymentMethods } from '../actions'
import { updateCart, deleteCart, updateTotalLocalItem } from '../../productDetails/actions'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../../productDetails/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/models'
import { MODULE_NAME as MODULE_USER_CART } from '../models'
import UserCartDetail from '../components/UserCartDetail'
import { CART_STATUS } from '../../../common/models'
import { round } from '../../../common/utils/format'

const mapDispatchToProps = (dispatch, props) => ({
  onChangeProductQuantity: ({ carts, cart, detail, index, quantity, totalItem }) => {
    const { amounts } = cart
    const changeValue = (quantity - cart.details[index].quantity)
    cart.metaData.totalQuantity += changeValue
    cart.details[index].quantity = Math.abs(quantity)
    if (detail.cashUnitId !== null) {
      const cashAmount = cart.amounts.find(item => item.currencyUnitId === detail.cashUnitId)
      cashAmount.value += parseFloat(detail.cashValue, 10) * changeValue
      cashAmount.value = round(cashAmount.value, 2)

      const cash = amounts.find(item =>
        item.isSelect === true &&
        (item.currencyUnitId === null || item.currencyUnitId === detail.cashUnitId))
      if (cash) {
        cash.value = parseFloat(detail.cashValue, 10) * changeValue
        cash.value = round(cash.value, 2)
      }
    }
    if (detail.electricUnitId !== null) {
      const electricAmount = cart.amounts.find(item => item.currencyUnitId === detail.electricUnitId)
      electricAmount.value += parseFloat(detail.electricValue, 10) * changeValue
      electricAmount.value = round(electricAmount.value, 8)

      const electric = amounts.find(item =>
        item.isSelect === true && item.currencyUnitId === detail.electricUnitId)
      if (electric) {
        electric.value += parseFloat(detail.electricValue, 10) * changeValue
        electricAmount.value = round(electricAmount.value)
      }
    }
    dispatch(updateCart())
    dispatch(updateTotalLocalItem(totalItem + changeValue))
  },
  onChangeUserNote: ({ carts, cart, note }) => {
    cart.metaData.buyerNote = note
    dispatch(updateCart())
  },
  addCart: (carts, data, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/add-cart`
      return loading(dispatch, async () => {
        const response = await axios({
          url,
          method: 'POST',
          data: data,
          headers: {
            Authorization: token
          }
        })
        if (response && response.data) {
          dispatch(deleteCart({ shopId: data.metaData.shopId }))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteCart: (cart) => {
    try {
      dispatch(deleteCart({ shopId: cart.metaData.shopId }))
      return true
    } catch (error) {
      return false
    }
  },
  onSelectShippingType: ({ carts, cart, shopShippingTypeId }) => {
    let curCart = carts.find(cartItem => cartItem.metaData.shopId === cart.metaData.shopId)
    curCart = curCart.metaData.shopShippingTypeId = shopShippingTypeId

    dispatch(updateCart(curCart))
  },
  onSelectePaymentMethod: ({ carts, cart, payment, index }) => {
    const { payments, amounts } = cart
    payments.forEach((p, i) => {
      if ((payment.paymentTypeId === 1 || payment.paymentTypeId === 2) &&
        (p.paymentTypeId === 1 || p.paymentTypeId === 2)) {
        if (i === index) {
          p.isSelect = !payment.isSelect
        } else {
          p.isSelect = false
        }
      } else {
        if (p.paymentTypeId === payment.paymentTypeId) {
          if (i === index) {
            p.isSelect = !payment.isSelect
          } else {
            p.isSelect = false
          }
        }
      }
    })

    // const amount = amounts.find(am => {
    //   if ((payment.currencyUnitId === null ||
    //     payment.currencyUnitId === 1) &&
    //     am.currencyUnitId === 1) {
    //     return am
    //   }
    //   if (payment.currencyUnitId === am.currencyUnitId) {
    //     return am
    //   }
    // })
    const amount = amounts.find(item => payment.currencyUnitId.includes(item.currencyUnitId))
    if (amount) {
      payments[index].value = amount.value
    }
    dispatch(updateCart())
  },

  getUserPaymentMethods: async (userId, token) => {
    try {
      const filter = {
        where: {
          'shopId': null
        }
      }
      const url = `${BASE_URL}/api/users/${userId}/userPaymentMethods?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await axios({
          url,
          headers: {
            Authorization: token
          }
        })
        if (response && response.data) {
          dispatch(getUserPaymentMethods(response.data))
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
  user: state[MODULE_USER].user,
  userPayments: state[MODULE_USER].userPayments,
  carts: state[MODULE_PRODUCT_DETAIL].carts,
  totalItem: state[MODULE_PRODUCT_DETAIL].cartSummary.totalItem,
  currencyUnits: state.common.units,
  paymentTypes: state.common.paymentTypes,
  userPaymentMethods: state[MODULE_USER_CART].userPaymentMethods
})

export default connect(mapStateToProps, mapDispatchToProps)(UserCartDetail)
