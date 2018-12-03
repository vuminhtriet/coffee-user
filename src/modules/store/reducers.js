import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  stores: [],
  detail: null,
  categoryProducts: [],
  privateCategories: [],
  storeRatings: []
}

const handlers = {
  [actions.setStoreProducts]: (state, action) => ({
    ...state,
    ...{ products: action.payload }
  }),
  [actions.setStoreCategories]: (state, action) => ({
    ...state,
    ...{ privateCategories: action.payload }
  }),
  [actions.setStoreInformation]: (state, action) => ({
    ...state,
    ...{ detail: action.payload }
  }),
  [actions.getStoreRatings]: (state, action) => ({
    ...state,
    ...{ storeRatings: action.payload }
  }),
  [actions.getCategoryProducts]: (state, action) => ({
    ...state,
    ...{ categoryProducts: action.payload }
  })
}

export default handleActions(handlers, defaultState)
