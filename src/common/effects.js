import { takeEvery, all, select } from 'redux-saga/effects'
import {
  loadEnd,
  loadStart,
  fetchStart,
  fetchSuccess,
  fetchFailure } from './actions/common'
import { config } from './configs'
import axios from 'axios'
import PageLoading from './components/widgets/PageLoading'
import ModalLoading from './components/widgets/ModalLoading'
import { mapDispatchToProps as userHanders } from '../modules/user/containers/UserSetting'

function * onFetchStart ({ payload: { config } }) {
  // console.log('Fetch Start', config)
}

function * onFetchSuccess ({ payload: { response, config } }) {
  // console.log('Fetch Success', config)
}

function * onFetchFailure ({ payload: { error, config } }) {
  // Notification.error(error.message)
}

function * watchFetchStart () {
  yield takeEvery(fetchStart.toString(), onFetchStart)
}
function * watchFetchSuccess () {
  yield takeEvery(fetchSuccess.toString(), onFetchSuccess)
}
function * watchFetchFailure () {
  yield takeEvery(fetchFailure.toString(), onFetchFailure)
}

function * onLoadingChanged () {
  // TODO: Do something in redux when loading
  const isLoading = yield select(state => state.loading.isLoading)
  const loadingCount = yield select(state => state.loading.loadingCount)
  if (!isLoading && loadingCount === 0) {
    PageLoading.hide()
    ModalLoading.hide()
  } else if (isLoading && loadingCount === 1) {
    PageLoading.show()
    ModalLoading.show()
  }
}

function * watchLoadStart () {
  yield takeEvery(loadStart.toString(), onLoadingChanged)
}

function * watchLoadEnd () {
  yield takeEvery(loadEnd.toString(), onLoadingChanged)
}

export default getState => {
  function * rootSaga () {
    yield all([
      watchFetchStart(),
      watchFetchSuccess(),
      watchFetchFailure(),
      watchLoadStart(),
      watchLoadEnd()
    ])
  }
  return rootSaga
}

export async function loading (dispatch, fetchingProcess, done = undefined) {
  dispatch(loadStart({config: {key: 'loading'}}))
  try {
    const ret = await fetchingProcess()
    dispatch(loadEnd({config: {key: 'loading'}}))
    if (done) {
      await done()
    }
    return ret
  } catch (error) {
    dispatch(loadEnd({config: {key: 'loading'}}))
    if (error.response) {
      console.log('ERROR REQUEST', error.response)
    } else {
      console.log('ERROR', error)
    }
    throw error
  }
}

export function fetch ({ url, ...options }, dispatch = null) {
  if (!url) {
    return false
  }
  dispatch && dispatch(fetchStart({config: { key: url }}))
  return axios({
    method: 'get',
    timeout: config.timeout ? config.timeout : 0,
    url,
    ...options
  }).then((response) => {
    dispatch && dispatch(fetchSuccess({config: { key: url }}))
    return response
  }).catch((err) => {
    dispatch && dispatch(fetchFailure({config: { key: url }}))
    if (dispatch && err.response && err.response.status === 401) {
      const handlers = userHanders(dispatch, {})
      handlers.logout()
    }
    throw err
  })
}
