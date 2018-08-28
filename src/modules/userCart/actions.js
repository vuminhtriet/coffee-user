import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const confirmCart = createAction(`${MODULE_NAME}_confirmCart`)
export const checkoutCart = createAction(`${MODULE_NAME}_checkoutCart`)
export const updateCart = createAction(`${MODULE_NAME}_updateCart`)

export const changeProductQuantity = createAction(`${MODULE_NAME}_changeProductQuantity`)
export const setCartDetail = createAction(`${MODULE_NAME}_setCartDetail`)
export const setCarts = createAction(`${MODULE_NAME}_setCarts`)
export const setShopShippingTypes = createAction(`${MODULE_NAME}_setShopShippingTypes`)
export const deleteCart = createAction(`${MODULE_NAME}_deleteCart`)

export const getUserPaymentMethods = createAction(`${MODULE_NAME}_getUserPaymentMethods`)
