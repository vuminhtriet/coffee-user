import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  carts: [],
  userCarts: [],
  fees: [],
  totalAmount: '3000$',
  totalItem: '4',
  lastUpdated: '',
  shopShippingTypes: [],
  cart: null
}

const handlers = {
  [actions.addPayments]: (state, action) => ({
    ...state,
    ...{
      shopPayments: [
        ...state.shopPayments,
        action.payload
      ]
    }
  }),
  [actions.addDeliveryMethod]: (state, action) => ({
    ...state,
    ...{
      shopDeliveryMethods: [
        ...state.shopDeliveryMethods,
        action.payload
      ]
    }
  }),
  [actions.changeCart]: (state, action) => {
    const carts = state.carts.map((item) => {
      if (item.id === action.payload.id) {
        return action.payload
      }
      return item
    })
    return {
      ...state,
      ...{ carts: carts }
    }
  },
  [actions.setCarts]: (state, action) => ({
    ...state,
    ...{ carts: action.payload }
  }),
  [actions.setCartDetail]: (state, action) => ({
    ...state,
    ...{ cart: action.payload }
  }),
  [actions.setShopShippingTypes]: (state, action) => ({
    ...state,
    ...{ shopShippingTypes: action.payload }
  }),
  [actions.deleteCart]: (state, action) => ({
    ...state,
    ...{ cart: null }
  }),
  [actions.setUserCarts]: (state, action) => ({
    ...state,
    ...{ userCarts: action.payload }
  }),
  [actions.updateQuantity]: (state, action) => ({
    ...state,
    ...{
      cart: {
        ...cart,
        shoppingCartDetails: state.cart.shoppingCartDetails.map(item => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: action.payload.quantity }
          }
          return { ...item }
        })
      }
    }
  }),
  [actions.deleteProduct]: (state, action) => ({
    ...state,
    ...{
      cart: {
        ...cart,
        shoppingCartDetails: state.cart.shoppingCartDetails.filter(item => item.id !== action.payload.id)
      }
    }
  })
}

export default handleActions(handlers, defaultState)
