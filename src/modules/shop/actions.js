import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const addPayments = createAction(`${MODULE_NAME}_addPayments`)
export const setShopPayment = createAction(`${MODULE_NAME}_setShopPayment`)
export const addDeliveryMethod = createAction(`${MODULE_NAME}_addDeliveryMethod`)
export const setShopDeliveryMethods = createAction(`${MODULE_NAME}_setShopDeliveryMethods`)

export const changeCart = createAction(`${MODULE_NAME}_changeCart`)
export const setShopCarts = createAction(`${MODULE_NAME}_setShopCarts`)

export const setShopInformation = createAction(`${MODULE_NAME}_setShopInformation`)
export const setShopAddress = createAction(`${MODULE_NAME}_setShopAddress`)

export const setShopOrders = createAction(`${MODULE_NAME}_setShopOrders`)
export const setOrderDetail = createAction(`${MODULE_NAME}_setOrderDetail`)
export const updateOrder = createAction(`${MODULE_NAME}_updateOrder`)
export const setShippingType = createAction(`${MODULE_NAME}_setShippingType`)

export const setShopCategories = createAction(`${MODULE_NAME}_setShopCategories`)

export const getShopProducts = createAction(`${MODULE_NAME}_getShopProducts`)
export const loadMoreShopProducts = createAction(`${MODULE_NAME}_loadMoreShopProducts`)
export const setShopImage = createAction(`${MODULE_NAME}_setShopImage`)

export const deleteShopPayment = createAction(`${MODULE_NAME}_deleteShopPayment`)
export const deleteShopShippingType = createAction(`${MODULE_NAME}_deleteShopShippingType`)

export const deleteProof = createAction(`${MODULE_NAME}_deleteProof`)
