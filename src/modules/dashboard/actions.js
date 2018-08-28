import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const getFlashSaleProducts = createAction(`${MODULE_NAME}_getFlashSaleProducts`)
export const loadMoreFlashSaleProducts = createAction(`${MODULE_NAME}_loadMoreFlashSaleProducts`)
export const getPopularProducts = createAction(`${MODULE_NAME}_getPopularProducts`)
export const getPopularShops = createAction(`${MODULE_NAME}_getPopularShops`)
export const getDashboardPopularShops = createAction(`${MODULE_NAME}_getDashboardPopularShops`)
export const loadMorePopularProducts = createAction(`${MODULE_NAME}_loadMorePopularProducts`)
export const loadMorePopularShops = createAction(`${MODULE_NAME}_loadMorePopularShops`)
export const getTodayProducts = createAction(`${MODULE_NAME}_getTodayProducts`)
export const getCategories = createAction(`${MODULE_NAME}_getCategories`)
export const getCategoryProducts = createAction(`${MODULE_NAME}_getCategoryProducts`)
export const getSearchProducts = createAction(`${MODULE_NAME}_getSearchProducts`)
export const loadMoreSearchProducts = createAction(`${MODULE_NAME}_loadMoreSearchProducts`)
export const getSearchShops = createAction(`${MODULE_NAME}_getSearchShops`)
export const loadMoreSearchShops = createAction(`${MODULE_NAME}_loadMoreSearchShops`)
export const getBanners = createAction(`${MODULE_NAME}_getBanners`)
