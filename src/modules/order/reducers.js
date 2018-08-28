import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  units: [
  ],
  paymentTypes: [
  ],
  paymentMethods: [
  ]
}

const handlers = {
  [actions.setPaymentType]: (state, action) => ({
    ...state,
    ...{ paymentTypes: action.payload }
  }),
  [actions.setCurrencyUnit]: (state, action) => ({
    ...state,
    ...{ units: action.payload }
  })
}

export default handleActions(handlers, defaultState)
