import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  coins: [],
  offset: 0
}

const handlers = {
  [actions.getCoins]: (state, action) => ({
    ...state,
    ...{ coins: action.payload.coins, offset: action.payload.offset }
  }),
  [actions.appendCoins]: (state, action) => ({
    ...state,
    ...{ coins: [...state.coins, ...action.payload.coins], offset: action.payload.offset }
  })
}

export default handleActions(handlers, defaultState)
