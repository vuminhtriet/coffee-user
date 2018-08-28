import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const loadMessages = createAction(`${MODULE_NAME}_loadMessages`)
export const updateMessages = createAction(`${MODULE_NAME}_updateMessages`)
export const loadConversations = createAction(`${MODULE_NAME}_loadConversations`)
export const updateHistoryFilter = createAction(`${MODULE_NAME}_updateHistoryFilter`)
export const setCurrentUser = createAction(`${MODULE_NAME}_setCurrentUser`)
export const setUserInfo = createAction(`${MODULE_NAME}_setUserInfo`)
