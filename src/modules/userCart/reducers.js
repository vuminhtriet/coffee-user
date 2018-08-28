import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  carts: [],
  userPaymentMethods: []
}

const handlers = {
  [actions.addPayments]: (state, action) => ({
    ...state,
    ...{ shopPayments: [
      ...state.shopPayments,
      action.payload
    ] }
  }),
  [actions.addDeliveryMethod]: (state, action) => ({
    ...state,
    ...{ shopDeliveryMethods: [
      ...state.shopDeliveryMethods,
      action.payload
    ] }
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
  [actions.updateCart]: (state, action) => {
    const carts = state.carts
    return {
      ...state,
      ...{ carts: [...carts] }
    }
  },
  [actions.getUserPaymentMethods]: (state, action) => ({
    ...state,
    ...{ userPaymentMethods: action.payload }
  })
}

export default handleActions(handlers, defaultState)
