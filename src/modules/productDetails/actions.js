import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

// Update product detail info
export const onUpdateProductDetail = createAction(`${MODULE_NAME}_onUpdateProductDetail`)
export const onUpdateProductPrices = createAction(`${MODULE_NAME}_onUpdateProductPrices`)

// Cart handle
export const onAddToCart = createAction(`${MODULE_NAME}_onAddToCart`)
export const updateCart = createAction(`${MODULE_NAME}_onUpdateCart`)
export const deleteCart = createAction(`${MODULE_NAME}_deleteCart`)
export const updateTotalLocalItem = createAction(`${MODULE_NAME}_updateTotalLocalItem`)

// Product Infos
export const getproductVariations = createAction(`${MODULE_NAME}_getproductVariations`)
export const getProductPrices = createAction(`${MODULE_NAME}_getProductPrices`)
export const getShopInfo = createAction(`${MODULE_NAME}_getShopInfo`)
export const getShopRatingAndComment = createAction(`${MODULE_NAME}_getShopRatingAndComment`)
export const getShopProducts = createAction(`${MODULE_NAME}_getShopProducts`)
export const getProductRatings = createAction(`${MODULE_NAME}_getProductRatings`)
export const getTotalRatingValue = createAction(`${MODULE_NAME}_getTotalRatingValue`)
export const getTotalUserRating = createAction(`${MODULE_NAME}_getTotalUserRating`)
