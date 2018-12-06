import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  user: null,
  token: null,
  countries: [],
  boughtProducts: [],
  userOrders: [],
  cities: [],
  userPayments: [],
  userImage: null,
  order: null
}

const handlers = {
  [actions.setUserImage]: (state, action) => ({
    ...state,
    ...{ userImage: action.payload }
  }),
  [actions.setUserInfomation]: (state, action) => ({
    ...state,
    ...{ user: action.payload }
  }),
  [actions.setUserToken]: (state, action) => ({
    ...state,
    ...{ token: action.payload }
  }),
  [actions.setCountries]: (state, action) => ({
    ...state,
    ...{ countries: action.payload }
  }),
  [actions.setBoughtProduct]: (state, action) => ({
    ...state,
    ...{ boughtProducts: action.payload }
  }),
  [actions.setUserOrders]: (state, action) => ({
    ...state,
    ...{ userOrders: action.payload }
  }),
  [actions.setOrderDetail]: (state, action) => ({
    ...state,
    ...{ order: action.payload }
  }),
  [actions.setCities]: (state, action) => ({
    ...state,
    ...{ cities: action.payload }
  }),
  [actions.setUserPayment]: (state, action) => ({
    ...state,
    ...{ userPayments: action.payload }
  }),
  [actions.addUserPayments]: (state, action) => ({
    ...state,
    ...{ user: {
      ...state.user,
      userPaymentMethods: [
        ...state.user.userPaymentMethods,
        action.payload
      ]
    }}
  })
}

export default handleActions(handlers, defaultState)
