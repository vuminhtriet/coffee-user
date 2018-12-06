import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setUserInfomation = createAction(`${MODULE_NAME}_setUserInfomation`)
export const setUserToken = createAction(`${MODULE_NAME}_setUserToken`)
export const setCountries = createAction(`${MODULE_NAME}_setCountries`)
export const setCities = createAction(`${MODULE_NAME}_setCities`)

export const setBoughtProduct = createAction(`${MODULE_NAME}_setBoughtProduct`)
export const setUserOrders = createAction(`${MODULE_NAME}_setUserOrders`)
export const setOrderDetail = createAction(`${MODULE_NAME}_setOrderDetail`)

export const setUserPayment = createAction(`${MODULE_NAME}_setUserPayment`)
export const addUserPayments = createAction(`${MODULE_NAME}_addUserPayments`)

export const setUserImage = createAction(`${MODULE_NAME}_setUserImage`)
