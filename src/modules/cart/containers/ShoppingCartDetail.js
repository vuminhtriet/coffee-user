import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setCartDetail, deleteCart, updateQuantity, deleteProduct } from '../actions'
import { MODULE_NAME as MODULE_CART } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import ShoppingCartDetail from '../components/ShoppingCartDetail'
import moment from 'moment'
import { round } from '../../../common/utils/format'

const mapDispatchToProps = (dispatch, props) => ({
  getCartDetail: async (id, token) => {
    try {
      const filter = {
        include: [
          {
            'user': [
              {
                'relation': 'userPaymentMethods',
                'scope': {
                  'where': {
                    'status': 'active',
                    'shopId': null
                  },
                  'include': [
                    { 'paymentType': 'currencyUnits' }
                  ]
                }
              }
            ]
          },
          { 'address': 'country' },
          {
            'shop': [
              'images',
              {
                'relation': 'shopPaymentMethods',
                'scope': {
                  'where': {
                    'status': 'active'
                  },
                  'include': [
                    { 'paymentType': 'currencyUnits' }
                  ]
                }
              },
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
          {
            'relation': 'shoppingCartDetails',
            'scope': {
              'include': [
                {
                  'relation': 'product',
                  'scope': {
                    'include': [
                      'images',
                      {
                        'relation': 'productPrices',
                        'scope': {
                          'where': {
                            'status': 1
                          },
                          'include': [
                            {
                              'relation': 'promotionPrice',
                              'scope': {
                                'where': {
                                  'status': 1
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  'relation': 'productVariation',
                  'scope': {
                    'where': {
                      'status': 1
                    }
                  }
                },
                {
                  'relation': 'cashUnit',
                  'scope': {
                    'where': {
                      'status': 1
                    }
                  }
                },
                {
                  'relation': 'electricUnit',
                  'scope': {
                    'where': {
                      'status': 1
                    }
                  }
                }
              ],
              'where': {
                'status': 1
              }
            }
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
          dispatch(setCartDetail(response.data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  addCart: (id, data, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${id}/update-cart`
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
          dispatch(setCartDetail(null))
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
  },
  updateQuantity: (cartId, detailId, quantity, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${cartId}/shoppingCartDetails/${detailId}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PUT',
          headers: {
            Authorization: token
          },
          data: {
            quantity
          }
        }, dispatch)
        if (response && response.data) {
          updateQuantity({ id: detailId, quantity })
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteProduct: (cartId, detailId, token) => {
    try {
      const url = `${BASE_URL}/api/shoppingCarts/${cartId}/shoppingCartDetails/${detailId}`
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
          deleteProduct({ id: detailId })
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

    const shoppingCartDetails = cart && cart.shoppingCartDetails
      ? cart.shoppingCartDetails
        .map(item => {
          const product = item.product && item.product.status === 1 ? item.product : null
          const cash = (item.cashUnitId && item.cashUnit) || (!item.cashUnitId && !item.cashUnit)
          const electric = (item.electricUnitId && item.electricUnit) || (!item.electricUnitId && !item.electricUnit)
          const price = product && product.productPrices && product.productPrices
            .find(elem => elem.cashUnitId === item.cashUnitId && elem.electricUnitId === item.electricUnitId)
          const promotionPrice = price && price.promotionPrice && moment(price.promotionPrice.toDate).isSameOrAfter(moment())
            ? price.promotionPrice
            : null
          const variant = item.productVariation
          return product && price && variant && variant.quantity > 0 && cash && electric
            ? {
              ...item,
              isValid: true,
              price,
              promotionPrice
            }
            : {
              ...item,
              isValid: false,
              price,
              promotionPrice
            }
        })
      : []

    const amounts = shoppingCartDetails
      .filter(item => item.isValid)
      .reduce((x, y) => {
        const cash = x.find(item => item.currencyUnitId === y.cashUnitId)
        const electric = x.find(item => item.currencyUnitId === y.electricUnitId)
        // const price = y.product.productPrices
        //   .find(elem => elem.cashUnitId === y.cashUnitId && elem.electricUnitId === y.electricUnitId)
        // const promotionPrice = price.promotionPrice && moment(price.promotionPrice.toDate).isSameOrAfter(moment())
        const newCashValue = y.promotionPrice
          ? y.promotionPrice.cashValue * y.quantity
          : y.price.cashValue * y.quantity

        const newElectricValue = y.promotionPrice
          ? y.promotionPrice.electricValue * y.quantity
          : y.price.electricValue * y.quantity

        if (cash) {
          cash.value += newCashValue
          cash.value = round(cash.value, 2)
        } else if (!cash && y.cashUnitId) {
          x = [
            ...x,
            {
              currencyUnitId: y.cashUnitId,
              status: 1,
              type: 0,
              value: round(newCashValue, 2),
              currencyUnit: y.cashUnit
            }
          ]
        }

        if (electric) {
          electric.value += newElectricValue
          electric.value = round(electric.value, 8)
        } else if (!electric && y.electricUnitId) {
          x = [
            ...x,
            {
              currencyUnitId: y.electricUnitId,
              status: 1,
              type: 0,
              value: round(newElectricValue, 8),
              currencyUnit: y.electricUnit
            }
          ]
        }

        return x
      }, [])

    return cart ? { ...cart, amounts, shoppingCartDetails } : cart
  })(),
  units: state.common.units,
  user: state[MODULE_USER].user
})

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartDetail)
