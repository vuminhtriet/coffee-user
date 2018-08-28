import axios from 'axios'
import { connect } from 'react-redux'
import * as firebase from '../../../common/firebase'
import ChatDetail from '../components/ChatDetail'
import { MODULE_NAME } from '../models'
import { loadMessages, updateMessages, setUserInfo } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  loadMessage: (conversationId) => {
    let unsubscribe = null
    dispatch(loadMessages([]))
    unsubscribe = firebase.subscribeMessage(conversationId, (querySnapshot) => {
      dispatch(updateMessages(querySnapshot.docChanges))
    })
    return unsubscribe
  },
  setMessage: (messages) => {
    dispatch(loadMessages(messages))
  },
  sendMessage: (senderUserId, conversationId, message) => {
    firebase.sendMessage(senderUserId, conversationId, message)
  },
  uploadChatImage: (fileName, filePath, onUploadSuccess) => {
    firebase.uploadChatImage(fileName, filePath, onUploadSuccess)
  },
  updateReadStatus: (conversationId, userId) => {
    firebase.updateReadStatus(conversationId, userId + '')
  },
  unsubscribeMessage: () => {
    unsubscribe()
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
  },
  getShopProducts: async (shop) => {
    try {
      const filter = {
        include: [
          'productPrices',
          'countries',
          'productVariations',
          'images'
        ]
      }
      const url = `${BASE_URL}/api/shops/${shop.id}/products?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        return response.data
      }
      return false
    } catch (error) {
      return false
    }
  },
  getProductDetail: async (token, productId) => {
    const filter = {
      include: [
        'productPrices',
        'countries',
        'productVariations',
        'images'
      ]
    }
    try {
      const url = `${BASE_URL}/api/products/${productId}?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url,
        headers: {
          Authorization: token
        }
      })
      if (response && response.data) {
        return response.data
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  messages: state[MODULE_NAME].messages,
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token,
  currencyUnits: state['common'].units
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetail)
