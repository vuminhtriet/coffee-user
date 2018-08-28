import { handleActions } from 'redux-actions'

import * as actions from './actions'
import { STRING_DELIMITER } from './models'

const defaultState = {
  messages: [],
  conversations: [],
  displayConversations: [],
  historyFilter: {
    readMsg: true,
    unreadMsg: true,
    fromUser: true,
    fromStore: true,
    userFilter: ''
  },
  unreadCount: 0,
  userList: {},
  currentUserId: null
}

const handlers = {
  [actions.setCurrentUser]: (state, action) => ({
    ...state,
    ...{ currentUserId: action.payload }
  }),
  [actions.setUserInfo]: (state, action) => {
    const userList = state.userList
    const newUser = action.payload
    userList[newUser.id + ''] = newUser
    return {
      ...state,
      ...{ userList: userList }
    }
  },
  [actions.loadMessages]: (state, action) => ({
    ...state,
    ...{ messages: [...action.payload] }
  }),
  [actions.updateMessages]: (state, action) => {
    let messages = state.messages
    const updateMessages = action.payload
    updateMessages.forEach(function (change) {
      const updateMessage = change.doc.data()
      updateMessage['id'] = change.doc.id
      if (change.type === 'added') {
        messages.push(updateMessage)
      }
      if (change.type === 'modified') {
        messages = messages.filter(x => x.id != updateMessage.id)
        messages.push(updateMessage)
      }
      if (change.type === 'removed') {

      }
    })
    return {
      ...state,
      ...{ messages: [...messages] }
    }
  },
  [actions.loadConversations]: (state, action) => {
    const conversations = action.payload
    const displayConversations = filterConversation(conversations, state.historyFilter, state)
    return {
      ...state,
      ...{ conversations: [...action.payload] },
      ...{ displayConversations: [...displayConversations] },
      ...{ unreadCount: countUnreadMsg(conversations, state)}
    }
  },
  [actions.updateHistoryFilter]: (state, action) => {
    const conversations = state.conversations
    const historyFilter = action.payload
    const displayConversations = filterConversation(conversations, historyFilter, state)
    return {
      ...state,
      ...{ historyFilter: action.payload },
      ...{ displayConversations: [...displayConversations] }
    }
  }

}

function countUnreadMsg (conversations, state) {
  const currentUserId = state.currentUserId
  return conversations.filter(conversation => {
    return conversation.readStatus && !conversation.readStatus[currentUserId]
  }).length
}

function filterConversation (conversations, historyFilter, state) {
  const currentUserId = state.currentUserId
  let displayConversations = conversations.filter(conversation => {
    const memberIds = conversation.id.split(STRING_DELIMITER)
    const ownStoreId = memberIds[1]
    if (historyFilter.readMsg != historyFilter.unreadMsg) {
      const readStatus = conversation.readStatus ? conversation.readStatus[currentUserId] : true
      return historyFilter.readMsg && readStatus || historyFilter.unreadMsg && !readStatus
    }

    if (historyFilter.fromStore != historyFilter.fromUser) {
      if (historyFilter.fromStore) {
        if (currentUserId == ownStoreId) return false
      } else if (historyFilter.fromUser) {
        if (currentUserId != ownStoreId) return false
      }
    }

    const userFilter = historyFilter.userFilter
    const userList = state.userList
    if (userFilter && userFilter != '') {
      const opponentUserId = currentUserId == memberIds[0] ? memberIds[1] : memberIds[0]
      const opponentUser = userList[opponentUserId + '']
      if (!opponentUser) { return false }
      let name = opponentUser.displayName
      if (ownStoreId == opponentUserId && opponentUser.shop && opponentUser.shop.name) {
        name = opponentUser.shop.name
      }
      if (name.toLowerCase().indexOf(userFilter.toLowerCase()) == -1) {
        return false
      }
    }
    return true
  })
  return displayConversations
}

export default handleActions(handlers, defaultState)
