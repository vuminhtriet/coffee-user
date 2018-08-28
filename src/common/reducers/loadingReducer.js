import { handleActions } from 'redux-actions'
import {
  loadEnd,
  loadStart,
  fetchStart,
  fetchSuccess,
  fetchFailure
} from '../actions/common'

const updateFetching = (fetching, payload, upDown) => {
  const { config } = payload
  const key = config.key || config.url
  if (upDown < 0 && fetching[key] + upDown === 0) {
    delete fetching[key]
  } else {
    fetching[key] = (fetching[key] || 0) + upDown
  }
  return fetching
}

const defaultState = {
  loadingCount: 0,
  isLoading: false,
  fetching: {}
}

const handlers = {
  [fetchStart]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, 1) }
  }),
  [fetchSuccess]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  }),
  [fetchFailure]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  }),
  [loadStart]: (state, action) => ({
    ...state,
    ...{
      loadingCount: state.loadingCount + 1,
      isLoading: true
    }
  }),
  [loadEnd]: (state, action) => ({
    ...state,
    ...{
      loadingCount: state.loadingCount - 1,
      isLoading: state.loadingCount > 1
    }
  })
}

export default handleActions(handlers, defaultState)
