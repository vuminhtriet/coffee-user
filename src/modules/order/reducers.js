import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  units: [
  ],
  paymentTypes: [
  ],
  paymentMethods: [
  ],
  shop:{},
  order:{}
}

const handlers = {
  [actions.setPaymentType]: (state, action) => ({
    ...state,
    ...{ paymentTypes: action.payload }
  }),
  [actions.setCurrencyUnit]: (state, action) => ({
    ...state,
    ...{ units: action.payload }
  }),
  [actions.setOrder]: (state, action) => ({
    ...state,
    ...{ order: action.payload }
  }),
  [actions.setShopDetail]: (state, action) => ({
    ...state,
    ...{ shop: action.payload }
  })
}

export default handleActions(handlers, defaultState)
