import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setPaymentType = createAction(`${MODULE_NAME}_setPaymentType`)

export const setCurrencyUnit = createAction(`${MODULE_NAME}_setCurrencyUnit`)
