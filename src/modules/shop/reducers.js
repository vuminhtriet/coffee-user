import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  shop: {},
  shopAddress: {},
  shopPayments: [],
  shippingTypes: [],
  shopCategories: [],
  shopProducts: [],
  shopDeliveryMethods: [],
  orders: [],
  order: null,
  carts: [],
  shopImages: []
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
  [actions.setShopPayment]: (state, action) => ({
    ...state,
    ...{ shopPayments: action.payload }
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
  [actions.setShopCarts]: (state, action) => {
    return {
      ...state,
      ...{ carts: action.payload }
    }
  },
  [actions.setShopInformation]: (state, action) => ({
    ...state,
    ...{ shop: action.payload }
  }),
  [actions.setShopAddress]: (state, action) => ({
    ...state,
    ...{ shopAddress: action.payload }
  }),
  [actions.setShopOrders]: (state, action) => ({
    ...state,
    ...{ orders: action.payload }
  }),
  [actions.setOrderDetail]: (state, action) => ({
    ...state,
    ...{ order: action.payload }
  }),
  [actions.updateOrder]: (state, action) => ({
    ...state,
    order: { ...state.order, ...action.payload }
  }),
  [actions.setShippingType]: (state, action) => ({
    ...state,
    ...{ shippingTypes: action.payload }
  }),
  [actions.setShopDeliveryMethods]: (state, action) => {
    return {
      ...state,
      ...{ shopDeliveryMethods: action.payload }
    }
  },
  [actions.setShopCategories]: (state, action) => {
    return {
      ...state,
      ...{ shopCategories: action.payload }
    }
  },
  [actions.getShopProducts]: (state, action) => ({
    ...state,
    ...{ shopProducts: action.payload }
  }),
  [actions.loadMoreShopProducts]: (state, action) => ({
    ...state,
    ...{ shopProducts: [...state.shopProducts, ...action.payload] }
  }),
  [actions.setShopImage]: (state, action) => {
    return {
      ...state,
      ...{ shopImages: action.payload }
    }
  },
  [actions.deleteShopPayment]: (state, action) => {
    return {
      ...state,
      ...{ shopPayments: state.shopPayments.filter(item => item.id !== action.payload) }
    }
  },
  [actions.deleteShopShippingTypes]: (state, action) => {
    return {
      ...state,
      ...{ shopDeliveryMethods: state.shopDeliveryMethods.filter(item => item.id !== action.payload) }
    }
  },
  [actions.deleteProof]: (state, action) => {
    const shoppingCartPayments =
      state.order && state.order.shoppingCartPayments && state.order.shoppingCartPayments.map((item) => {
        if (item.id === action.payload.shoppingCartPaymentId) {
          const proof = item.proofs && item.proofs.length > 0 && item.proofs.find(elem => elem.id === action.payload.id)
          if (proof) {
            const images = item.proofs.filter(elem => elem.id !== action.payload.id)
            return { ...item, proofs: images }
          } else {
            return { ...item }
          }
        } else {
          return { ...item }
        }
      })
    const order = state.order ? { ...state.order, shoppingCartPayments } : state.order
    return {
      ...state,
      ...{ order: order }
    }
  }
}

export default handleActions(handlers, defaultState)
