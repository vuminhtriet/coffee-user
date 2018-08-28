import firebase from 'react-native-firebase'
import { STRING_DELIMITER } from './models'

let messageDB = firebase.firestore().collection('messages')
let conversationDB = firebase.firestore().collection('conversations')
let storageRef = firebase.storage().ref()
let chatStorageRef = firebase.storage().ref('chat')
let productStorageRef = firebase.storage().ref('products')
let proofStorageRef = firebase.storage().ref('proofs')
let shopStorageRef = firebase.storage().ref('shops')
let userStorageRef = firebase.storage().ref('users')

export const subscribeConversation = (userId, onUpdateCallback) => {
  return conversationDB.doc(userId).collection('conversations').orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => onUpdateCallback(querySnapshot))
}

export const subscribeMessage = (conversationId, onUpdateCallback) => {
  return messageDB.doc(conversationId).collection('messages').orderBy('createdAt').onSnapshot((querySnapshot) => onUpdateCallback(querySnapshot))
}

export const sendMessage = (senderUserId, conversationId, message) => {
  const currentTime = new Date().getTime()
  message['createdAt'] = currentTime
  messageDB.doc(conversationId).collection('messages').add(message)
  const memberIds = conversationId.split(STRING_DELIMITER)
  const opponentUserId = senderUserId === memberIds[0] ? memberIds[1] : memberIds[0]
  let conversation = {
    createdAt: currentTime,
    message: message.message,
    messageType: message.messageType,
    sender: senderUserId,
    readStatus: {
      [senderUserId]: true,
      [opponentUserId]: false
    }
  }

  memberIds.forEach(memberId => {
    conversationDB.doc(memberId).collection('conversations').doc(conversationId).set(conversation)
  })
}

export const updateReadStatus = (conversationId, userId) => {
  conversationDB.doc(userId).collection('conversations').doc(conversationId).update({[`readStatus.${userId}`]: true})
}

export const uploadChatImage = (fileName, filePath, onUploadSuccess) => {
  const currentTime = new Date().getTime()
  const imagesRef = chatStorageRef.child(currentTime + '/' + fileName)
  imagesRef.put(filePath).then(function (snapshot) {
    onUploadSuccess(snapshot.ref)
  })
}

export const uploadProductImage = (productId, fileName, filePath) => {
  const currentTime = new Date().getTime()
  const imagesRef = productStorageRef.child(`${productId}/${currentTime}_${fileName}`)
  return imagesRef.putFile(filePath)
}

export const uploadProofImage = (paymentId, fileName, filePath) => {
  const currentTime = new Date().getTime()
  const imagesRef = proofStorageRef.child(`${paymentId}/${currentTime}_${fileName}`)
  return imagesRef.putFile(filePath)
}

export const uploadUserImage = (userId, fileName, filePath) => {
  const currentTime = new Date().getTime()
  const imagesRef = userStorageRef.child(`${userId}/${currentTime}_${fileName}`)
  return imagesRef.putFile(filePath)
}

export const getFileRef = (filePath) => {
  storageRef.child(filePath)
}

export const getDownloadLink = (filePath, onUploadSuccess) => {
  var imagesRef = storageRef.child(filePath)
  imagesRef.getDownloadURL().then(function (uri) {
    onUploadSuccess(uri)
  })
  .catch(err => {
    onUploadSuccess(err)
  })
}

export const getProductLink = (filePath) => {
  const imagesRef = productStorageRef.child(filePath.substr(9))
  return imagesRef.getDownloadURL()
}

export const deleteProductImage = (filePath) => {
  const imagesRef = productStorageRef.child(filePath.substr(9))
  return imagesRef.delete()
}

export const deleteUserImage = (filePath) => {
  const imagesRef = userStorageRef.child(filePath.substr(9))
  return imagesRef.delete()
}

export const uploadShopImage = (id, fileName, filePath) => {
  const currentTime = new Date().getTime()
  const imagesRef = shopStorageRef.child(`${id}/${currentTime}_${fileName}`)
  return imagesRef.putFile(filePath)
}

export const getShopLink = (filePath) => {
  const imagesRef = shopStorageRef.child(filePath.substr(9))
  return imagesRef.getDownloadURL()
}

export const deleteShopImage = (filePath) => {
  const imagesRef = shopStorageRef.child(filePath.substr(9))
  return imagesRef.delete()
}
