import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const getProducts = createAction(`${MODULE_NAME}_getProducts`)
