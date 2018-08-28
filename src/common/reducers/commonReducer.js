import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'

const defaultState = {
  userLanguage: null,
  setting: {},
  notifications: {},
  countries: [],
  units: [],
  paymentTypes: [],
  categories: [],
  shippingTypes: [],
  cities: []
}

const handlers = {
  [actions.setUserLanguage]: (state, action) => ({
    ...state,
    ...{ userLanguage: action.payload }
  }),
  [actions.setCountries]: (state, action) => ({
    ...state,
    ...{ countries: action.payload }
  }),
  [actions.setPaymentTypes]: (state, action) => ({
    ...state,
    ...{ paymentTypes: action.payload }
  }),
  [actions.setUnits]: (state, action) => ({
    ...state,
    ...{ units: action.payload }
  }),
  [actions.setCategories]: (state, action) => ({
    ...state,
    ...{ categories: action.payload }
  }),
  [actions.setShippingTypes]: (state, action) => ({
    ...state,
    ...{ shippingTypes: action.payload }
  }),
  [actions.setCities]: (state, action) => ({
    ...state,
    ...{ cities: action.payload }
  }),
  [actions.updateSetting]: (state, action) => ({
    ...state,
    ...{
      setting: action.payload
    }
  }),
  [actions.updateSettingProperties]: (state, action) => ({
    ...state,
    setting: {
      ...state.setting,
      ...action.payload
    }
  })
}

export default handleActions(handlers, defaultState)
