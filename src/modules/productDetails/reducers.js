import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  carts: [],
  cartSummary: {
    totalItem: 0
  },
  shopProducts: [],
  productRatings: [],
  totalRatingValue: 0,
  totalUserRating: 0
}

const handlers = {
  [actions.onUpdateProductDetail]: (state, action) => ({
    ...state,
    ...{ productDetail: action.payload }
  }),
  [actions.onUpdateProductPrices]: (state, action) => ({
    ...state,
    ...{ productPrices: action.payload }
  }),
  [actions.getShopInfo]: (state, action) => ({
    ...state,
    ...{ shopInfo: { ...action.payload } }
  }),
  [actions.getShopRatingAndComment]: (state, action) => ({
    ...state,
    ...{ shopRatingAndComment: action.payload }
  }),
  [actions.getShopProducts]: (state, action) => ({
    ...state,
    ...{ shopProducts: action.payload }
  }),
  [actions.getproductVariations]: (state, action) => ({
    ...state,
    ...{ productVariations: action.payload }
  }),
  [actions.getProductPrices]: (state, action) => ({
    ...state,
    ...{ productPrices: action.payload }
  }),
  [actions.onAddToCart]: (state, action) => ({
    ...state,
    ...{ carts: action.payload }
  }),
  [actions.updateCart]: (state, action) => {
    const carts = state.carts
    return {
      ...state,
      ...{ carts: [...carts] }
    }
  },
  [actions.deleteCart]: (state, action) => ({
    ...state,
    ...{ carts: state.carts.filter(item => item.metaData.shopId !== action.payload.shopId) }
  }),
  [actions.updateTotalLocalItem]: (state, action) => ({
    ...state,
    ...{ cartSummary: {
      totalItem: action.payload
    }}
  }),
  [actions.getProductRatings]: (state, action) => ({
    ...state,
    ...{ productRatings: action.payload }
  }),
  [actions.getTotalRatingValue]: (state, action) => ({
    ...state,
    ...{ totalRatingValue: action.payload }
  }),
  [actions.getTotalUserRating]: (state, action) => ({
    ...state,
    ...{ totalUserRating: action.payload }
  })
}

export default handleActions(handlers, defaultState)
