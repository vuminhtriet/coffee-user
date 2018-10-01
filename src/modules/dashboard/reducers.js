import { handleActions } from 'redux-actions'

import * as actions from './actions'
import { imgUtils } from '../../common/imgUtils'

const defaultState = {
  flashSaleProducts: [],
  popularProducts: [],
  dashboardPopularProducts: [],
  popularShops: [],
  dashboardPopularShops: [],
  todayProducts: [],
  categories: [],
  categoryProducts: [],
  searchProducts: [],
  searchShops: [],
  banner: []
}

const handlers = {
  [actions.getFlashSaleProducts]: (state, action) => ({
    ...state,
    ...{ flashSaleProducts: action.payload }
  }),
  [actions.loadMoreFlashSaleProducts]: (state, action) => ({
    ...state,
    ...{ flashSaleProducts: [...state.flashSaleProducts, ...action.payload] }
  }),
  [actions.getPopularProducts]: (state, action) => ({
    ...state,
    ...{ popularProducts: action.payload }
  }),
  [actions.getDashboardPopularProducts]: (state, action) => ({
    ...state,
    ...{ dashboardPopularProducts: action.payload }
  }),
  [actions.getPopularShops]: (state, action) => ({
    ...state,
    ...{ popularShops: action.payload }
  }),
  [actions.getDashboardPopularShops]: (state, action) => ({
    ...state,
    ...{ dashboardPopularShops: action.payload }
  }),
  [actions.loadMorePopularProducts]: (state, action) => ({
    ...state,
    ...{ popularProducts: [...state.popularProducts, ...action.payload] }
  }),
  [actions.loadMorePopularShops]: (state, action) => ({
    ...state,
    ...{ popularShops: [...state.popularShops, ...action.payload] }
  }),
  [actions.getTodayProducts]: (state, action) => ({
    ...state,
    ...{ todayProducts: action.payload }
  }),
  [actions.getCategories]: (state, action) => ({
    ...state,
    ...{ categories: action.payload }
  }),
  [actions.getCategoryProducts]: (state, action) => ({
    ...state,
    ...{ categoryProducts: action.payload }
  }),
  [actions.loadMoreCategoryProducts]: (state, action) => ({
    ...state,
    ...{ categoryProducts: [...state.categoryProducts, ...action.payload] }
  }),
  [actions.getSearchProducts]: (state, action) => ({
    ...state,
    ...{ searchProducts: action.payload }
  }),
  [actions.loadMoreSearchProducts]: (state, action) => ({
    ...state,
    ...{ searchProducts: [...state.searchProducts, ...action.payload] }
  }),
  [actions.getSearchShops]: (state, action) => ({
    ...state,
    ...{ searchShops: action.payload }
  }),
  [actions.loadMoreSearchShops]: (state, action) => ({
    ...state,
    ...{ searchShops: [...state.searchShops, ...action.payload] }
  }),
  [actions.getBanners]: (state, action) => ({
    ...state,
    ...{ banner: action.payload }
  })
}

export default handleActions(handlers, defaultState)
