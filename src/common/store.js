import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSaga from './effects'
import commonReducer from './reducers/commonReducer'
import loadingReducer from './reducers/loadingReducer'
import demoReducer from '../modules/demo/reducers'
import orderReducer from '../modules/order/reducers'
import shopReducer from '../modules/shop/reducers'
import userReducer from '../modules/user/reducers'
import chatReducer from '../modules/chat/reducers'
import productsReducer from '../modules/products/reducers'
import productDetailReducer from '../modules/productDetails/reducers'
import cartReducer from '../modules/cart/reducers'
import storeReducer from '../modules/store/reducers'
import dashboardReducer from '../modules/dashboard/reducers'
import userCartReducer from '../modules/userCart/reducers'
import { MODULE_NAME as MODULE_DEMO } from '../modules/demo/models'
import { MODULE_NAME as MODULE_USER } from '../modules/user/models'
import { MODULE_NAME as MODULE_CHAT } from '../modules/chat/models'
import { MODULE_NAME as MODULE_ORDER } from '../modules/order/models'
import { MODULE_NAME as MODULE_SHOP } from '../modules/shop/models'
import { MODULE_NAME as MODULE_PRODUCTS } from '../modules/products/models'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../modules/productDetails/models'
import { MODULE_NAME as MODULE_CART } from '../modules/cart/models'
import { MODULE_NAME as MODULE_STORE } from '../modules/store/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../modules/dashboard/models'
import { MODULE_NAME as MODULE_SHOPPING_CART } from '../modules/userCart/models'

const config = {
  blacklist: ['notification', 'loading'],
  key: 'root',
  storage
}

const createMiddlewares = sagaMiddleware => {
  const middlewares = []
  if (sagaMiddleware) {
    middlewares.push(sagaMiddleware)
  }
  return applyMiddleware.apply({}, middlewares)
}

const createReducers = reducers => {
  return persistCombineReducers(config, {
    common: commonReducer,
    loading: loadingReducer,
    [MODULE_ORDER]: orderReducer,
    [MODULE_DEMO]: demoReducer,
    [MODULE_USER]: userReducer,
    [MODULE_CHAT]: chatReducer,
    [MODULE_SHOP]: shopReducer,
    [MODULE_PRODUCTS]: productsReducer,
    [MODULE_CART]: cartReducer,
    [MODULE_STORE]: storeReducer,
    [MODULE_DASHBOARD]: dashboardReducer,
    [MODULE_PRODUCT_DETAIL]: productDetailReducer,
    [MODULE_SHOPPING_CART]: userCartReducer,
    ...reducers
  })
}

const composeEnhancers = __DEV__
? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
: compose
const buildStore = (reducers, initialState) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(createReducers(reducers), initialState, composeEnhancers(createMiddlewares(sagaMiddleware)))

  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(createReducers(reducers))
    })
  }
  const persistor = persistStore(store)
  store.reducers = createReducers(reducers)
  sagaMiddleware.run(createSaga(store.getState))
  return { persistor, store }
}

export default buildStore()
