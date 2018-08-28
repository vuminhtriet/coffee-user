import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  Modal,
  Dimensions
} from 'react-native'
import { Icon } from 'react-native-elements'
import ImageResizer from 'react-native-image-resizer'
import MessageForm from './MessageForm'
import FastMessage from './FastMessage'
import HeaderChat from './HeaderChat'
import ChooseProduct from './ChooseProduct'
import ChatItem from './ChatItem'
import { STRING_DELIMITER } from '../models'
import styles from '../styles/chatDetailStyles'
import { SCREENS } from '../../../common/screens'
const ImagePicker = require('react-native-image-picker')
const { height } = Dimensions.get('window')

const options = {
  title: 'Upload your payment proof',
  storageOptions: {
    skipBackup: true,
    noData: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true
  }
}


export default class ChatDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      showProductChoose: false,
      showImageView: false
    }

    const currentUserId = this.props.user.id + ''
    const { params } = this.props.navigation.state;
    if (params.conversationId) {
      this.conversationId = params.conversationId;
    } else if (params.userId) {
      this.conversationId = currentUserId + STRING_DELIMITER + params.userId
    }

    const memberIds = this.conversationId.split(STRING_DELIMITER)
    this.opponentUserId = this.conversationId.replace(currentUserId, '').replace(STRING_DELIMITER, '')
    this.isChatWithShop = this.opponentUserId == memberIds[1] ? true : false
  }

  componentWillUpdate(nextProps, nextState) {
    this.scrollToEndYN = false
    if (this.props.messages.length != nextProps.length) {
      this.scrollToEndYN = true
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.scrollToEndYN) {
      this.flatList.scrollToEnd({ animated: true })
      this.scrollToEndYN = false
    }
  }

  async getOpponentInfo() {
    const { getUserInfo, token } = this.props

    const result = await getUserInfo(token, this.opponentUserId)
    if (result) {
      this.setState({ opponentUser: result })
    }
  }

  async getCurrentInfo() {
    const { getUserInfo, token } = this.props
    const currentUserId = this.props.user.id + ''
    const result = await getUserInfo(token, currentUserId)
    if (result) {
      this.setState({ currentUser: result })
    }
  }

  componentDidMount() {
    const { loadMessage, updateReadStatus  }  = this.props
    this.getOpponentInfo()
    this.getCurrentInfo()
    const currentUserId = this.props.user.id + ''
    this.unsubscribe = loadMessage(this.conversationId)
    updateReadStatus(this.conversationId, currentUserId)
  }

  componentWillUnmount() {
    const { updateReadStatus, setMessage } = this.props
    const currentUserId = this.props.user.id + ''
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    setMessage([])
    updateReadStatus(this.conversationId, currentUserId)
  }

  onRefresh = () => {
  }

  onLoadMore = () => {
    //Load more chat
  }

  keyExtractor = (item) => {
    return item.id
  }

  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  sendTextMessage = (text) => {
    if (!text || text == '') {
      return
    }
    const currentUserId = this.props.user.id + ''
    let message = {
      message: text,
      messageType: 1,
      sender: currentUserId
    }
    this.props.sendMessage(currentUserId, this.conversationId, message)
  }

  onSelectImage = (response) => {
    let fileName = null
    let fileUri = null
    let fileData = null
    let filePath = null
    // let fileOriginUri = null
    if (response.didCancel) {
      return false
    } else if (response.error) {
      return false
    } else if (response.customButton) {
      return false
    } else {
      fileName = response.fileName
      fileUri = response.uri
      // fileOriginUri = response.origURL
      fileData = response.data
      filePath = response.path
    }
    ImageResizer.createResizedImage(fileUri, 720, 1280, 'JPEG', 60)
      .then((response) => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        this.props.uploadChatImage(fileName, response.path, (imagePath) => {
          const currentUserId = this.props.user.id + ''
          let message = {
            message: imagePath,
            messageType: 2,
            sender: currentUserId
          }
          this.props.sendMessage(currentUserId, this.conversationId, message)
        })
      }).catch((err) => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        //attactProof(payment, { data: fileData, value: fileName })
      })
  }

  getPhotosFromGallery = () => {
    ImagePicker.launchImageLibrary(options, this.onSelectImage)
  }

  getPhotosFromCamera = () => {
    ImagePicker.launchCamera(options, this.onSelectImage)
  }

  onChooseProduct = (choosenProductIds) => {
    this.setState({ showProductChoose: false })
    const currentUserId = this.props.user.id + ''
    choosenProductIds.forEach(productId => {
      let message = {
        message: productId,
        messageType: 3,
        sender: currentUserId
      }
      this.props.sendMessage(currentUserId, this.conversationId, message)
    })
  }

  onCancelChooseProduct = () => {
    this.setState({ showProductChoose: false })
  }

  getProductInfo = () => {
    this.setState({ showProductChoose: true })
  }

  onViewImage = (imageURI) => {
    this.setState({ showImageView: true, currentImageURI: imageURI })
  }

  onCloseImgae = () => {
    this.setState({ showImageView: false })
  }

  openShopDetail = () => {
    const { navigation } = this.props
    const { opponentUser } = this.state
    if (opponentUser && opponentUser.shop) {
      navigation.navigate(SCREENS.StoreDetail, { id: opponentUser.shop.id })
    }
  }

  openCartDetail = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.UserCart)
  }

  openHome = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.TabStack)
  }

  render() {
    const { refreshing, showProductChoose, showImageView, opponentUser, currentUser, currentImageURI } = this.state
    const { messages, updateReadStatus, user, token, getShopProducts, getProductDetail, currencyUnits, navigation } = this.props
    let shopUser = currentUser
    if (this.isChatWithShop) {
      shopUser = opponentUser
    }

    const currentUserId = user ? user.id + '' : ''
    let title = ''
    if (opponentUser != null) {
      title = opponentUser.displayName
      if (this.isChatWithShop && opponentUser.shop && opponentUser.shop.name) {
        title = opponentUser.shop.name
      }
    }

    return (
      <View style={styles.container}>
        <View style={{ width: '100%' }}>
          <HeaderChat onBack={this.onBack} title={title} openShopDetail={this.openShopDetail} openHome={this.openHome}/>
        </View>
        <FlatList
          ref={ref => this.flatList = ref}
          onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
          onLayout={() => this.flatList.scrollToEnd({ animated: true })}
          style={styles.chatList}
          data={messages}
          refreshing={refreshing}
          keyExtractor={this.keyExtractor}
          renderItem={(item, index) => <ChatItem
            item={item.item}
            index={index}
            user={user}
            opponentUser={opponentUser}
            isChatWithShop={this.isChatWithShop}
            token={token}
            onViewImage={this.onViewImage}
            getProductDetail={getProductDetail}
            currencyUnits={currencyUnits}
            openShopDetail={this.openShopDetail}
            navigation={navigation}
          />}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
        <View style={{ width: '100%', height: 32 }}>
          <FastMessage sendMessage={this.sendTextMessage} />
        </View>
        <MessageForm
          sendMessage={this.sendTextMessage} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10, marginLeft: 30, marginRight: 30 }}>
          <Icon name='picture-o' type='font-awesome' onPress={this.getPhotosFromGallery} />
          <Icon name='camera' type='font-awesome' onPress={this.getPhotosFromCamera} />
          {/* <Icon name='insert-emoticon' onPress={() => updateReadStatus(this.conversationId, currentUserId)} /> */}
          <Icon name='product-hunt' type='font-awesome' onPress={this.getProductInfo} />
          <Icon name='shopping-cart' color='#E65647' type='font-awesome' onPress={this.openCartDetail} />
        </View>
        <Modal
          animationType='slide'
          transparent={false}
          visible={showProductChoose}
        >
          <View style={{ width: '100%', height }}>
            <ChooseProduct
              onChooseProduct={this.onChooseProduct}
              onCancelChooseProduct={this.onCancelChooseProduct}
              getShopProducts={getShopProducts}
              user={shopUser}
              token={token}
              currencyUnits={currencyUnits} />
          </View>
        </Modal>

        <Modal
          animationType='slide'
          transparent={false}
          visible={showImageView}
        >
          <View style={{ width: '100%', height }}>
            <Icon
              containerStyle={{
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 2
              }}
              onPress={() => this.onCloseImgae()}
              name='close'
              color='#E4521B'
            />
            <Image
              style={styles.image}
              resizeMode={'contain'}
              source={{ uri: currentImageURI }}
            />
          </View>
        </Modal>
      </View>
    )
  }
}