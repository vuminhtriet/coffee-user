import axios from 'axios'
import { connect } from 'react-redux'
import * as firebase from '../../../common/firebase'
import ChatHistory from '../components/ChatHistory'
import { setCurrentUser, loadConversations, updateHistoryFilter, setUserInfo } from '../actions'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  loadConversations: (userId) => {
    let unsubscribe = null
    dispatch(setCurrentUser(userId))
    unsubscribe = firebase.subscribeConversation(userId, (querySnapshot) => {
      let conversations = []
      querySnapshot.forEach((doc) => {
        let conversation = doc.data()
        conversation['id'] = doc.id
        conversations.push(conversation)
      })
      dispatch(loadConversations(conversations))
    })
    return unsubscribe
  },
  setConversations: (conversations) => {
    dispatch(loadConversations(conversations))
  },
  updateHistoryFilter: (filter) => {
    dispatch(updateHistoryFilter(filter))
  },
  getUserInfo: async (token, userId) => {
    try {
      const url = `${BASE_URL}/api/users/${userId}`
      const response = await axios({
        url,
        headers: {
          Authorization: token
        },
        params: {
          filter: {
            include: ['shop', 'images']
          }
        }
      })
      if (response && response.data) {
        dispatch(setUserInfo(response.data))
        return response.data
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  conversations: state[MODULE_NAME].conversations,
  displayConversations: state[MODULE_NAME].displayConversations,
  historyFilter: state[MODULE_NAME].historyFilter,
  userList: state[MODULE_NAME].userList,
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory)
