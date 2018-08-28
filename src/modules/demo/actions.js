import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const getCoins = createAction(`${MODULE_NAME}_getCoins`)
export const appendCoins = createAction(`${MODULE_NAME}_appendCoins`)
