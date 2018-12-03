import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setStoreProducts = createAction(`${MODULE_NAME}_setStoreProducts`)
export const setStoreCategories = createAction(`${MODULE_NAME}_setStoreCategories`)
export const setStoreInformation = createAction(`${MODULE_NAME}_setStoreInformation`)
export const getCategoryProducts = createAction(`${MODULE_NAME}_getCategoryProducts`)
export const getStoreRatings = createAction(`${MODULE_NAME}_getProductRatings`)
